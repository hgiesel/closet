from aqt import mw
from aqt.reviewer import Reviewer
from aqt.webview import WebContent

from aqt.gui_hooks import webview_will_set_content

def append_scripts(web_content: WebContent, context):
    if not isinstance(context, Reviewer):
        return

    addon_package = mw.addonManager.addonFromModule(__name__)

    web_content.css.append(
        f"/_addons/{addon_package}/web/my-addon.css")
    web_content.js.append(
        f"/_addons/{addon_package}/web/my-addon.js")

    web_content.head += "<script>console.log('my-addon')</script>"
    web_content.body += "<div id='my-addon'></div>"

    from aqt.utils import showInfo

    # showInfo(str(dir(web_content)))
    # showInfo(str(dir(context)))

    showInfo(str(context.card))

webview_will_set_content.append(append_scripts)

mw.addonManager.setWebExports(__name__, r"web/.*(css|js)")
