/**
 * 组件：城市选择
 * @html text.html h5.html
 */
define(function(require, exports, module){
  var cityJson = require('../../data/city.json');
  var source = require('../../template/widget/city.html');
  var template = Handlebars.compile(source);
  
  function View(opts){
    this.$container = opts.$container;
    if(opts.city){
      this.list = opts.city.split(' '); //原来保存的城市
    }else{
      this.list = []; //保存用户选中的城市
    }
    
    this.init();
  };
  
  View.prototype.init = function(){
    this.render();
    this.bindEvent();
  };
    
  View.prototype.render = function(){
    var view = this,
        context = {
          'provinces': cityJson.provinces,
          'citys': cityJson.citys[cityJson.provinces[0]],
          'list': view.list
        };
    var html = template(context);
    view.$container.html(html);
    $(document).trigger('cityReady');
  };
  
  View.prototype.bindEvent = function(){
    var view = this;
    
    var addCity = function(city){
      if(city && ($.inArray(city, view.list) == -1) &&($.inArray('全国', view.list) == -1)){
        if(city == '全国'){
          view.list = [city];
          view.$container.find('.badges').empty().append(' <a class="badge" title="点击删除">'+city+'</a>');
        }else{
          view.list.push(city);
          view.$container.find('.badges').append(' <a class="badge" title="点击删除">'+city+'</a>');
        }
      }
      view.$container.parents('.control-group').removeClass('error')
                  .find('.controls-msg').html('').hide();
    };
    
    //删除城市
    view.$container.on('click', 'a.badge', function(){
      var i = $.inArray($(this).text(), view.list);
      view.list = view.list.del(i);
      $(this).remove();
      return false;
    });
    
    //添加城市
    view.$container.on('click', 'button.add', function(){
      var city = view.$container.find('[name="city"]').val(); 
      addCity(city);
      return false;
    });
    
    //批量添加城市
    view.$container.on('click', 'button.patch', function(){
      var pro = view.$container.find('select[name="province"]').val();
      var citys = cityJson.citys[pro];
      for(var i=0; i<citys.length; i++){
        addCity(citys[i]);
      }
      
      return false;
    });
    
    //切换省份
    view.$container.on('change', 'select[name="province"]', function(){
      var pro = $(this).val();
      var citys = cityJson.citys[pro];
      var html = '';
      for(var i=0; i<citys.length; i++){
        html += '<option value="'+citys[i]+'">'+citys[i]+'</option>';
      }
      view.$container.find('select[name="city"]').html(html);
    });
  };
  
  //获取用户选择的城市
  View.prototype.getValue = function(){
    return this.list.join(' ');
  }
   
  return View;
});