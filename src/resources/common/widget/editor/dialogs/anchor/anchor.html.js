define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\"\r\n \"http://www.w3.org/TR/html4/loose.dtd\">\r\n<html>\r\n <head>\r\n <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\r\n <title></title>\r\n <style type=\"text/css\">\r\n *{color: #838383;margin: 0;padding: 0}\r\n html,body {font-size: 12px;overflow: hidden; }\r\n .content{padding:5px 0 0 15px;}\r\n input{width:210px;height:21px;line-height:21px;margin-left: 4px;}\r\n </style>\r\n </head>\r\n <body>\r\n <div class=\"content\">\r\n <span><var id=\"lang_input_anchorName\"></var></span><input id=\"anchorName\" value=\"\" />\r\n </div>\r\n <script type=\"text/javascript\" src=\"../internal.js\"></script>\r\n <script type=\"text/javascript\">\r\n var anchorInput = $G('anchorName'),\r\n node = editor.selection.getRange().getClosedNode();\r\n if(node && node.tagName == 'IMG' && (node = node.getAttribute('anchorname'))){\r\n anchorInput.value = node;\r\n }\r\n anchorInput.onkeydown = function(evt){\r\n evt = evt || window.event;\r\n if(evt.keyCode == 13){\r\n editor.execCommand('anchor', anchorInput.value);\r\n dialog.close();\r\n domUtils.preventDefault(evt)\r\n }\r\n };\r\n dialog.onok = function (){\r\n editor.execCommand('anchor', anchorInput.value);\r\n dialog.close();\r\n };\r\n $focus(anchorInput);\r\n </script>\r\n </body>\r\n</html>";
=======
    module.exports="<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\"\n \"http://www.w3.org/TR/html4/loose.dtd\">\n<html>\n <head>\n <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\n <title></title>\n <style type=\"text/css\">\n *{color: #838383;margin: 0;padding: 0}\n html,body {font-size: 12px;overflow: hidden; }\n .content{padding:5px 0 0 15px;}\n input{width:210px;height:21px;line-height:21px;margin-left: 4px;}\n </style>\n </head>\n <body>\n <div class=\"content\">\n <span><var id=\"lang_input_anchorName\"></var></span><input id=\"anchorName\" value=\"\" />\n </div>\n <script type=\"text/javascript\" src=\"../internal.js\"></script>\n <script type=\"text/javascript\">\n var anchorInput = $G('anchorName'),\n node = editor.selection.getRange().getClosedNode();\n if(node && node.tagName == 'IMG' && (node = node.getAttribute('anchorname'))){\n anchorInput.value = node;\n }\n anchorInput.onkeydown = function(evt){\n evt = evt || window.event;\n if(evt.keyCode == 13){\n editor.execCommand('anchor', anchorInput.value);\n dialog.close();\n domUtils.preventDefault(evt)\n }\n };\n dialog.onok = function (){\n editor.execCommand('anchor', anchorInput.value);\n dialog.close();\n };\n $focus(anchorInput);\n </script>\n </body>\n</html>";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});