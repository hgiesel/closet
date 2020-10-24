from typing import Any
from aqt import mw


def find_addon_by_name(addon_name):
    for name in mw.addonManager.allAddons():
        if mw.addonManager.addonName(name) == addon_name:
            return name

    return None

class ProfileConfig:
    """Can be used for profile-specific settings"""

    def __init__(self, keyword: str, default: Any):
        self.keyword = keyword
        self.default = default

    @property
    def value(self) -> Any:
        return mw.pm.profile.get(self.keyword, self.default)

    @value.setter
    def value(self, new_value: Any):
        mw.pm.profile[self.keyword] = new_value

    def remove(self):
        try:
            del mw.pm.profile[self.keyword]
        except KeyError:
            # same behavior as Collection.remove_config
            pass

class ModelConfig:
    """Can be used for model-specific settings"""

    def __init__(self, keyword: str, default: Any):
        self.keyword = keyword
        self.default = default

    @property
    def model_id(self):
        return self.model['id']

    @model_id.setter
    def model_id(self, model_id: int):
        self.model = mw.col.models.get(model_id)

    @property
    def value(self) -> Any:
        return self.model[self.keyword] if self.keyword in self.model else self.default

    @value.setter
    def value(self, new_value: Any):
        self.model[self.keyword] = new_value

    def remove(self):
        try:
            del self.model[self.keyword]
        except KeyError:
            # same behavior as Collection.remove_config
            pass

# whether to hook closet into Asset Manager
closet_enabled = ModelConfig('closetEnable', True)

# shortcut in Editor
occlude_shortcut = ProfileConfig('closetOcclusionShortcut', 'Ctrl+O')
