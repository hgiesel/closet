from pathlib import Path
from os.path import dirname, realpath

from aqt import mw
from anki.hooks import addHook
from aqt.utils import showInfo

from .utils import find_addon_by_name
from .version import version


description = '''This is the compiled Closet source code.
You can visit the Closet homepage under https://closetengine.com.
If you find any bugs, have any questions, or want to contribute to the ongoing development of the Closet project, please visit github.com/hgiesel/closet.'''

script_name = 'Closet'
base_tag = f'{script_name}Tag'
base_id = f'{script_name}Id'

am = find_addon_by_name('Asset Manager')

if am:
    ami = __import__(am).src.lib.interface
    amr = __import__(am).src.lib.registrar

def get_closet_source():
    filepath = Path(dirname(realpath(__file__)), '..', 'web', 'closet.js')

    with open(filepath, mode='r', encoding='utf-8') as file:
        return file.read().strip()

def setup_script():
    if not am:
        showInfo('Closet requires Asset Manager to be installed.')
        return

    closet_source = get_closet_source()

    amr.make_and_register_interface(
        tag = base_tag,

        getter = lambda id, storage: ami.make_script(
            script_name,
            storage.enabled if storage.enabled is not None else True,
            'js',
            version,
            description,
            storage.position if storage.position is not None else 'external',
            storage.conditions if storage.conditions is not None else [],
            closet_source,
        ),

        setter = lambda id, script: True,

        store = ['enabled', 'conditions'],
        readonly = ['name', 'code', 'type', 'version', 'position', 'description'],

        label = lambda id, storage: 'Closet Source Code',
        reset = False,
    )

def install_script():
    if not am:
        return

    meta_script = ami.make_meta_script(
        base_tag,
        base_id,
    )

    # insert the script for every model
    for model_id in mw.col.models.ids():
        amr.register_meta_script(
            model_id,
            meta_script,
        )
