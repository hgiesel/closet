# -*- coding: utf-8 -*-
# Template Tools
# an Anki addon that allows you to use the functionality of the
# template language Closet from within Anki
# GitHub: https://github.com/hgiesel/closet/
#
# Copyright: 2020 Henrik Giesel <hengiesel@gmail.com>
#
# License: GNU AGPL, version 3 or later; http://www.gnu.org/copyleft/agpl.html

from aqt import mw
from os import path
import json

# Write manifest.json to config.json
if mw.addonManager.addonName(path.dirname(__file__)) != 'Template Tools':
    dir_path = path.dirname(path.realpath(__file__))

    with open(path.join(dir_path, 'manifest.json')) as f:
        config_data = {}

        try:
            with open(path.join(dir_path, 'meta.json')) as f_old:
                config_data = json.load(f_old)['config']

        except FileNotFoundError:
            pass

        meta = json.load(f)
        meta.update({
            'config': config_data,
        })

        mw.addonManager.writeAddonMeta(dir_path, meta)

from .src.main import setup_models_dialog, setup_hook

setup_models_dialog()
setup_hook()
