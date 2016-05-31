define(function(require, exports, module) {
    module.exports="<!DOCTYPE html>\r\n<html>\r\n <head>\r\n <title>chart</title>\r\n <meta chartset=\"utf-8\">\r\n <link rel=\"stylesheet\" type=\"text/css\" href=\"charts.css\">\r\n <script type=\"text/javascript\" src=\"../internal.js\"></script>\r\n </head>\r\n <body>\r\n <div class=\"main\">\r\n <div class=\"table-view\">\r\n <h3><var id=\"lang_data_source\"></var></h3>\r\n <div id=\"tableContainer\" class=\"table-container\"></div>\r\n <h3><var id=\"lang_chart_format\"></var></h3>\r\n <form name=\"data-form\">\r\n <div class=\"charts-format\">\r\n <fieldset>\r\n <legend><var id=\"lang_data_align\"></var></legend>\r\n <div class=\"format-item-container\">\r\n <label>\r\n <input type=\"radio\" class=\"format-ctrl not-pie-item\" name=\"charts-format\" value=\"1\" checked=\"checked\">\r\n <var id=\"lang_chart_align_same\"></var>\r\n </label>\r\n <label>\r\n <input type=\"radio\" class=\"format-ctrl not-pie-item\" name=\"charts-format\" value=\"-1\">\r\n <var id=\"lang_chart_align_reverse\"></var>\r\n </label>\r\n <br>\r\n </div>\r\n </fieldset>\r\n <fieldset>\r\n <legend><var id=\"lang_chart_title\"></var></legend>\r\n <div class=\"format-item-container\">\r\n <label>\r\n <var id=\"lang_chart_main_title\"></var><input type=\"text\" name=\"title\" class=\"data-item\">\r\n </label>\r\n <label>\r\n <var id=\"lang_chart_sub_title\"></var><input type=\"text\" name=\"sub-title\" class=\"data-item not-pie-item\">\r\n </label>\r\n <label>\r\n <var id=\"lang_chart_x_title\"></var><input type=\"text\" name=\"x-title\" class=\"data-item not-pie-item\">\r\n </label>\r\n <label>\r\n <var id=\"lang_chart_y_title\"></var><input type=\"text\" name=\"y-title\" class=\"data-item not-pie-item\">\r\n </label>\r\n </div>\r\n </fieldset>\r\n <fieldset>\r\n <legend><var id=\"lang_chart_tip\"></var></legend>\r\n <div class=\"format-item-container\">\r\n <label>\r\n <var id=\"lang_cahrt_tip_prefix\"></var>\r\n <input type=\"text\" id=\"tipInput\" name=\"tip\" class=\"data-item\" disabled=\"disabled\">\r\n </label>\r\n <p><var id=\"lang_cahrt_tip_description\"></var></p>\r\n </div>\r\n </fieldset>\r\n <fieldset>\r\n <legend><var id=\"lang_chart_data_unit\"></var></legend>\r\n <div class=\"format-item-container\">\r\n <label><var id=\"lang_chart_data_unit_title\"></var><input type=\"text\" name=\"unit\" class=\"data-item\"></label>\r\n <p><var id=\"lang_chart_data_unit_description\"></var></p>\r\n </div>\r\n </fieldset>\r\n </div>\r\n </form>\r\n </div>\r\n <div class=\"charts-view\">\r\n <div id=\"chartsContainer\" class=\"charts-container\"></div>\r\n <div id=\"chartsType\" class=\"charts-type\">\r\n <h3><var id=\"lang_chart_type\"></var></h3>\r\n <div class=\"scroll-view\">\r\n <div class=\"scroll-container\">\r\n <div id=\"scrollBed\" class=\"scroll-bed\"></div>\r\n </div>\r\n <div id=\"buttonContainer\" class=\"button-container\">\r\n <a href=\"#\" data-title=\"prev\"><var id=\"lang_prev_btn\"></var></a>\r\n <a href=\"#\" data-title=\"next\"><var id=\"lang_next_btn\"></var></a>\r\n </div>\r\n </div>\r\n </div>\r\n </div>\r\n </div>\r\n <script src=\"../../third-party/jquery-1.10.2.min.js\"></script>\r\n <script src=\"../../third-party/highcharts/highcharts.js\"></script>\r\n <script src=\"chart.config.js\"></script>\r\n <script src=\"charts.js\"></script>\r\n </body>\r\n</html>";
});