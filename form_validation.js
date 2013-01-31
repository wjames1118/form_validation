//adjust text 
var cs = {
	alpha:{
		han:"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-()@.,",
		zen:"ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９−（）＠．，"},
	space:{
		han:" ",
		zen:"　"},
};

//adjust space & fonts 
function cnvKana(str, option){
	if (!option) option = 'as';
	if (option.indexOf('a')>=0) str = cnvKanaMain(str, cs.alpha.zen, cs.alpha.han);//全形英數字元→半形英數字元
	if (option.indexOf('A')>=0) str = cnvKanaMain(str, cs.alpha.han, cs.alpha.zen);//半形英數字元→全形英數字元
	if (option.indexOf('s')>=0) str = cnvKanaMain(str, cs.space.zen, cs.space.han);//全形空白→半形空白
	if (option.indexOf('S')>=0) str = cnvKanaMain(str, cs.space.han, cs.space.zen);//半形空白→全形空白
	return str;
}


function cnvKanaMain(str, from, to){
	var retVal = '', chr, idx, margin, alt;
	for(var i=0; i<str.length; i++){
		chr = str.charAt(i);
		idx = from.indexOf(chr);
		if (idx>=0) chr = to.charAt(idx);
		retVal += chr;
	}
	return retVal;
}


String.prototype.cnvKana = function(option){
	return cnvKana(this, option);
}
String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g,'');
}
String.prototype.cnvZip= function(){
	var str = this.cnvKana('a');
	str = str.replace(/[^\d]/g, '');
	if (str.length > 3) str = str.slice(0,3)+'-'+str.slice(3,5);
	return str;
}
String.prototype.cnvPhone = function(){
	var str = this.cnvKana('as');
	str = str.replace(/[\(\)\s]/g, '-');
	str = str.replace(/[^\d-]/g, '');
	str = str.replace(/^-+|-+$/g, '');
	str = str.replace(/-+/g, '-');
	return str;
}

//validation
String.prototype.isNotEmpty = function(){
	return this != '';
}
String.prototype.isEmpty = function(){
	return this == '';
}
String.prototype.isShorterThan = function(n){
	return this.length <= n;
}
String.prototype.isLongerThan = function(n){
	return this.length >= n;
}
String.prototype.isZip = function(){
	return this.isEmpty() || /^\d{3}-\d{2}$/.test(this);
}
String.prototype.isPhone = function(){
	return this.isEmpty() || /^\d{2,4}-\d{3,4}-\d{3,4}$/.test(this);
}
String.prototype.isEmail = function(){
	return this.isEmpty() || /^([\w-]+\.?)+[\w-]+@[\w-]+(\.([\w-]+))+$/.test(this);
}

String.prototype.isNumber = function(){
	return this.isEmpty() || /^[0-9]*$/.test(this);
}


//form structure
var formValidation = function(name, feedback, fields){
	var form = document.forms[name];
	for (var i=0; i<form.elements.length; i++){
		(function(){
			var elm = form.elements[i];
			var f = fields[elm.name];
			if (f){
				f.element = elm;
				f.process = function(){
					var ok = true;
					if (f.convert) f.element.value = f.convert(f.element.value);
					if (f.validation) ok = f.validation(f.element.value);
					if (f.feedback) f.feedback(ok, f.element);
					return ok;
				}
				elm.onblur = function(e){ f.process() }
			}
		})();
	}
	form.onsubmit = function(){
		var all_ok = true;
		for (key in fields)
			if (fields[key] && !fields[key].process())
				all_ok = false;
		return feedback(all_ok);
	};
}