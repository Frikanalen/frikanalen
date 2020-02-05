/**
 * @name jsonform.js: for jQuery JsonForm Plugin
 * @description Create standard JSON from Forms or populate form with json using jQuery.
 * @requires jquery.js
 * @link Github: [https://github.com/milfont/jsonform](https://github.com/milfont/jsonform "https://github.com/milfont/jsonform") 
 * @author Christiano Milfont <cmilfont@gmail.com>
 * @license Copyright Milfont Consulting.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function ($) {

    /** @memberOf jQuery */
    $.fn.extend({
        /**
         * @version stable
         */
        version: '1.1.1',
        
        /**
         * Example:
         *     $('#form_id').getJSON(true);
         *
         */
         
         /**
         * Example:
         *     $("[name='formname']").getJSON();
         *
         */
         
         /** 
         * @description Create standard JSON from Forms with jQuery. Resolve nested objects.
         *
         * @name getJSON
         * @param {Boolean} byId find inputs with query by id
         * @returns {Object} Object Literal [json]
         * @type jQuery
         * @cat Plugins/jsonform
         */
        getJSON: function(byId) {
            var json = {}, self = this, config;
            if(typeof byId === 'object') {
                config = byId;
                byId = (config.byId)? config.byId : false;
            }
            self.find("input,textarea,select").each( function(index, item) {
                var name = (byId) ? $.trim(item.id) : $.trim(item.name);
                if(name !== "") {
                    self.merge(json, self.buildJson(name, item.value, config));
                }
            });
            return json;
        },
        
        /**
         *
         * Example: with ID for legacy code
         *     var lancamento = {
         *         empresa: {id: 2, name: "Teste"},
         *         partidas: [
         *             {conta: {codigo:"1.02.0002", nome: "Compras"}, natureza: "1"},
         *             {conta: {codigo:"1.02.0001", nome: "Banco"}, natureza: "-1"}
         *         ],
         *         description: "Teste",
         *         value: "125,67",
         *         date: "12/03/1999"
         *     };
         *     $('#form_id').populate(lancamento, true);
         */
         
         /** 
         * Example: with name [default]
         *     var lancamento = {
         *         empresa: {id: 2, name: "Teste"},
         *         partidas: [
         *             {conta: {codigo:"1.02.0002", nome: "Compras"}, natureza: "1"},
         *             {conta: {codigo:"1.02.0001", nome: "Banco"}, natureza: "-1"}
         *         ],
         *         description: "Teste",
         *         value: "125,67",
         *         date: "12/03/1999"
         *     };
         *     $("[name='form_name'").populate(lancamento);
         */
         
         /**
         * @name populate
         * @desc Populate form with json using jQuery. Resolve nested objects. 
         * @param {Object} json Standard JSON to populate FORM
         * @param {Boolean} [optional] byId find inputs with query by id
         * @returns {jQuery} jQuery
         * @type jQuery
         * @cat Plugins/jsonform
         */
        populate: function(json, byId) {
            var self = this;
            (function roam(el, father) {
                for(var property in el) {
                    if(el[property] || el[property] === 0) {
                        var value = el[property];
                        if( typeof value == "object") {
                            var parent = (!father)? property : father + "\\." + property;
                            if($.isArray(value)) {
                                for(var item in value) {
                                    if(value[item]) {
                                        parent_arr = parent + "\\["+item+"\\]";
                                        roam(value[item], parent_arr);
                                    }
                                }
                            } else {
                                roam(value, parent);
                            }
                            parent = null;
                        } else {
                            var name = (father)? father + "\\." + property : property;
                            var query = "[name='" + name + "']";
                            if(byId) { query = ("#" + name); }
                            self.find(query).val(value);
                        }
                    }
                }
            })(json);
            return this;
        },
        /**
         * @name buildJson
         * @param {String} id
         * @param {String} valor
         * @param {Object} config
         * @returns {Object} Object Literal
         */
        buildJson: function(id, valor, config) {
            
            var prefix = (config && config.prefix)? config.prefix:"";
            var suffix = (config && config.suffix)? config.suffix:"";
            
            var verifyArray = function(name, value) {
                var position;
                if( position = name.match(/\[(\d+)\]/)) {
                    var arr = [];
                    arr[ position[1] ] = value;
                    return arr;
                } else {
                    return value;
                }
            }

            return (function generateJSON(json, hierarchy, value) {
                var hierarchy = hierarchy.split(".");
                var first = hierarchy.shift();
                return function(json, name){
                    json[ prefix + name.replace(/\[(\d+)\]/, "") + suffix ] = (hierarchy.length > 0 ) ? 
                        verifyArray(name, generateJSON({}, hierarchy.join("."), value)) : 
                        verifyArray(name, value);
                    return json;
                }(json, first);
            })({}, id, valor);
        },
        /**
         * @name merge
         * @param {Object} merged
         * @param {Object} source
         * @returns {Object} Object Literal
         */
        merge: (function merge(merged, source) {
            for(var property in source) {
                if(typeof source[property] === 'object' &&
                typeof merged[property] !== "undefined") {
                    merge(merged[property], source[property]);
                } else {
                    merged[property] = source[property];
                }
            }
            return merged;
        }),
        /**
         * @name clone
         * @param {Object} source
         * @returns {Object} Object Literal
         */
        clone: function(source) {
            return this.merge({}, source);
        }
    });

})(jQuery);