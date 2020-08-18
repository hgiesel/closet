from string import Template

from aqt import mw
from anki.hooks import addHook
from aqt.utils import showInfo

from .utils import find_addon_by_name

script_name = 'Closetjs'

file_name = 'main'
user_file_name = 'user'

version = 'v1.0'
default_description = (
    'This is the configuration of how Closet will behave.\n'
    'To get inspiration you can visit the homepage.\n'
    'The defaults try already to be as useful as possible, so they might already suit your needs!\n'
)

pass_tag = f'{script_name}Pass'

am = find_addon_by_name('Asset Manager')

if am:
    ami = __import__(am).src.lib.interface
    amr = __import__(am).src.lib.registrar

class DoubleTemplate(Template):
    delimiter = '$$'

def indent(line: str, indentation: str) -> str:
    return indentation + line if len(line) > 0 else line

def indent_lines(text: str, indent_size: int) -> str:
    return '\n'.join([
        indent(line, indent_size * ' ')
        for line
        in text.split('\n')
    ])

def setup_pass_script():
    if not am:
        return

    from pathlib import Path
    from os.path import dirname, realpath

    filepath = Path(f'{dirname(realpath(__file__))}', '..', 'web', f'{file_name}.js')
    user_filepath = Path(f'{dirname(realpath(__file__))}', '..', 'web', f'{user_file_name}.js')

    with open(filepath, mode='r', encoding='utf-8') as file:
        with open(user_filepath, mode='r', encoding='utf-8') as user_file:
            script = file.read().strip()
            user_script = user_file.read().strip()

            amr.make_and_register_interface(
                # The name of script tag
                # Multiple scripts can be registered under the same tag
                # Scripts under one tag share one *interface*: rules for setting, getting, generation, stored fields, readonly fields, etc.
                tag = pass_tag,

                # What happens when the user tries to receive the script
                # This is is used for displaying the script in the tag window
                # the code is not necessarily the code that is actually inserted into the template: for that, see `generator`
                # however the conditions are used for calculating whether to insert
                getter = lambda id, storage: ami.make_script(
                    storage.name if storage.name is not None else 'Closet Pass',
                    storage.enabled if storage.enabled is not None else True,
                    'js',
                    version,
                    storage.description if storage.description is not None else default_description,
                    'into_template',
                    storage.conditions if storage.conditions is not None else [],
                    storage.code if storage.code is not None else user_script,
                ),

                # What happens when the user commits new changes to the script
                # Can be used for internal computation
                # returns a bool or ami.AMScript.
                # if returns True all fields defined in `store` are stored
                # if returns False no fields are stored ever
                # if returns ami.AMScript, this AMScript is used for saving, otherwise it's the same as the argument
                setter = lambda id, script: True,

                # Collection of fields that are stored on the side of Script Manager
                store = ['enabled', 'code', 'conditions'],
                # Collection of fields that are readonly
                readonly = ['name', 'type', 'version', 'position', 'description'],

                # Change the code that is showed in the script window
                # By default is "your_tag: your_id"
                # label = lambda id, storage: your code that returns str

                # Change the behavior when deleting the script
                # By default your script is not deletable
                # deletable = lambda id, storage: your code that returns bool (whether to delete or not)

                # Change the behavior when resetting the script
                # By default your script is reset to the getter function with an empty storage
                # this reset function does not reset the enabled status or the conditions
                reset = lambda id, storage: ami.make_script(
                    storage.name if storage.name else 'Closet Pass',
                    storage.enabled if storage.enabled else True,
                    'js',
                    version,
                    storage.conditions if storage.conditions is not None else default_description,
                    'into_template',
                    storage.conditions if storage.conditions is not None else [],
                    user_script,
                ),

                # Change the behavior when generating the script that is ultimately inserted into the template
                # By default it uses `getter(id, storage).code`
                # model is the note type name, tmpl is the card type name, fmt is 'qfmt' (front) or 'afmt' (back)
                # if your return an empty str, it won't insert anything
                generator = lambda id, storage, model, tmpl, pos: DoubleTemplate(script).safe_substitute(
                    userCode=indent_lines(storage.code if storage.code is not None else user_script, 4),
                    cardType='{{Card}}',
                    tagsFull='{{Tags}}',
                    side='front' if pos == 'question' else 'back',
                )
            )

def install_pass_script():
    # create the meta script which points to your interface
    if not am:
        return

    pass_meta_script = ami.make_meta_script(
        # this is the tag you interface above is registered on!
        pass_tag,
        # your id: you can register an id only once per model per tag
        f"{script_name}_id",
    )

    # insert the script for every model
    for model_id in mw.col.models.ids():
        amr.register_meta_script(
            model_id,
            pass_meta_script,
        )
