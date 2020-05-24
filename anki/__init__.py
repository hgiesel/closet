# -*- coding: utf-8 -*-
# Anki Tools
# an Anki addon that allows you to use the functionality of the
# template language Closet from within Anki
# GitHub: https://github.com/hgiesel/closet/
#
# Copyright: 2020 Henrik Giesel <hengiesel@gmail.com>
#
# License: GNU AGPL, version 3 or later; http://www.gnu.org/copyleft/agpl.html

from aqt import mw
import os.path as path

# Write manifest.json to config.json
if mw.addonManager.addonName(path.dirname(__file__)) != 'Straight Reward':
    dir_path = path.dirname(path.realpath(__file__))

    with open(path.join(dir_path, 'manifest.json')) as f:
        if path.exists('meta.json'):
            with open(path.join(dir_path, 'meta.json')) as f_old:
                import json
                mw.addonManager.writeAddonMeta(dir_path, json.load(f).update({
                    'config': json.load(f_old)['config']
                }))

from .src import main
