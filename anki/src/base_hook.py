from pathlib import Path
from os.path import dirname, realpath
from re import match

from aqt import mw, dialogs
from aqt.utils import showInfo

from .utils import find_addon_by_name, delimiters
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

def get_closet_source(model_id: int) -> str:
    filepath = Path(dirname(realpath(__file__)), '..', 'web', 'closet.js')

    delimiters.model_id = model_id
    delims = delimiters.value

    with open(filepath, mode='r', encoding='utf-8') as file:
        return file.read().strip()

def setup_script():
    if not am:
        showInfo('Closet requires Asset Manager to be installed.')
        return

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
            get_closet_source(id),
        ),

        setter = lambda id, script: True,

        store = ['enabled', 'position', 'conditions'],
        readonly = ['name', 'code', 'type', 'version', 'description'],

        label = lambda id, storage: 'Closet Source Code',
        reset = False,

        autodelete = lambda id, storage: not match(r'^\d+$', id),
    )

def install_script():
    if not am:
        return

    # insert the script for every model
    for model_id in mw.col.models.ids():
        meta_script = ami.make_meta_script(
            base_tag,
            str(model_id),
        )

        amr.register_meta_script(
            model_id,
            meta_script,
        )
