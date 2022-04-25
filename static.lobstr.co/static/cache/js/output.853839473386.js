"use strict";function short_key(address){if(address.length>30&&address.indexOf("@")<0){return address.slice(0,18)+'...'+address.slice(address.length-16);}
return address;};function flatten(obj){var empty=true;if(obj instanceof Array){str='';empty=true;for(var i=0;i<obj.length;i++){empty=false;str+=flatten(obj[i])+'.<br/>';}
return(empty?str:str.slice(0,-2))+'.';}else if(obj instanceof Object){str='';empty=true;for(i in obj){empty=false;str+=i+': '+flatten(obj[i])+'.<br/>';}
return(empty?str:str.slice(0,-6))+'.';}else{return obj;}}
function humanizeNumber(number,accuracy=7){if(number===0){return 0;}
if(!number){return'';}
number=parseFloat(number)
var lessAccuracyResult=parseFloat(Math.pow(0.1,accuracy).toFixed(accuracy))
while(lessAccuracyResult>number){accuracy++;lessAccuracyResult=parseFloat(Math.pow(0.1,accuracy).toFixed(accuracy))}
number=number.toFixed(accuracy);return parseFloat(number).toString();};function intWord(number){if(!number){return number}
number=parseFloat(number);var million=1000000;var billion=1000000000;var trillion=1000000000000;if(number>=trillion){return humanizeNumber(number/trillion,2)+'T';}
if(number>=billion){return humanizeNumber(number/billion,2)+'B';}
if(number>million){return humanizeNumber(number/million,2)+'M';}
return humanizeNumber(number);}
function humanizeAddress(address){if(!address){return'';}
var isValidFederationAddress=validateFederationAddress(address);if(isValidFederationAddress){var length=45;if(address.length<=length){return address;};return address.slice(0,length)+'...';}
var isValidAccountAddress=validateAccountAddress(address);var isValidAccountIdPattern=validateAccountIdPattern(address);if(isValidAccountAddress||isValidAccountIdPattern){var length=18;var margin=Math.floor(length/2)-1;if(address.length<=length){return address;};return address.slice(0,margin)+'...'+address.slice(address.length-margin);return address.slice(0,margin)+'...'+address.slice(address.length-margin);}
return address};"use strict";Handlebars.registerHelper('pretty_str',function(opts){if(!opts)return'';opts=opts.replace(/[_]/g," ");opts=opts.charAt(0).toUpperCase()+opts.slice(1);return new Handlebars.SafeString(opts);});Handlebars.registerHelper('get_icon_by_id',function(opts){if(!opts)return'';return $('#'+opts).attr('data-value');});Handlebars.registerHelper('short_key',short_key);Handlebars.registerHelper('first_letter',function(text){return text[0];});Handlebars.registerHelper('pretty_datetime',function(datetime){if(datetime){return moment(datetime).format("MMMM D, YYYY [at] HH:mm");}});Handlebars.registerHelper('length',function(text){return text.length;});Handlebars.registerHelper('ifCond',function(v1,operator,v2,options){switch(operator){case'==':return(v1==v2)?options.fn(this):options.inverse(this);case'===':return(v1===v2)?options.fn(this):options.inverse(this);case'!=':return(v1!=v2)?options.fn(this):options.inverse(this);case'!==':return(v1!==v2)?options.fn(this):options.inverse(this);case'<':return(v1<v2)?options.fn(this):options.inverse(this);case'<=':return(v1<=v2)?options.fn(this):options.inverse(this);case'>':return(v1>v2)?options.fn(this):options.inverse(this);case'>=':return(v1>=v2)?options.fn(this):options.inverse(this);case'&&':return(v1&&v2)?options.fn(this):options.inverse(this);case'||':return(v1||v2)?options.fn(this):options.inverse(this);default:return options.inverse(this);}});Handlebars.registerHelper('cut_address',function(address,length){if(!address)return'';var length=length||20,margin=Math.floor(length/2)-1;if(address.length>length&&address.indexOf("@")<0){return address.slice(0,margin)+'...'+address.slice(address.length-margin);}
return address;});Handlebars.registerHelper('truncatechars',function(chars,length){if(!chars)return'';var length=(length||30)-3;if(chars.length>length){return chars.slice(0,length)+'...';}
return chars;});Handlebars.registerHelper("toFixed",function(num,fractionDigits){if(isNaN(parseFloat(num))){throw new TypeError('expected a number');}
return truncateZeros(parseFloat(num).toFixed(fractionDigits));});Handlebars.registerHelper("capitalizeFirstLetter",function(value){return capitalizeFirstLetter(value);});Handlebars.registerHelper('json',function(context){return JSON.stringify(context);});Handlebars.registerHelper('pretty_extra_info',function(extraInfo){if(extraInfo&&extraInfo.message){return extraInfo.message;}
return flatten(extraInfo);});Handlebars.registerHelper('_',function(str){return(globalThis!=undefined?globalThis.gettext(str):str)});Handlebars.registerHelper('ngettext',function(msgid,plural,count){return(globalThis!=undefined?globalThis.ngettext(str):str)});Handlebars.registerHelper('humanize_address',humanizeAddress);Handlebars.registerHelper('humanize_number',function(number){if(!number){return'';}
number=parseFloat(number).toFixed(7);return parseFloat(number).toString();});"use strict";function validateDomain(domain){var domain_whitelist=['localhost','localhost:8000','127.0.0.1:8000']
if(domain_whitelist.includes(domain)){return true;};var domainRegex=new RegExp(/((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+)(?:[a-zA-Z]{2,63})/);return domain.match(domainRegex)!=null;};function validateURL(url){if(!url){return false;}
try{new URL(url);}catch{return false;}
return true;};"use strict";function validateAssetCode(code){var assetCodeRegex=new RegExp(/^[a-zA-Z0-9]{1,12}$/);return code.match(assetCodeRegex)!=null;}
function validateAccountId(accountId){try{return Boolean(StellarSdk.Keypair.fromPublicKey(accountId));}catch{return false;}};function validateMuxedAccount(address){try{StellarSdk.MuxedAccount.fromAddress(address,'0');}catch(err){return false;}
return true;};function validateAccountAddress(address){return validateAccountId(address)||validateMuxedAccount(address)}
function validateAccountIdPattern(accountId){var accountIdRegex=new RegExp(/^[a-zA-Z0-9]{1,56}$/);return accountId.match(accountIdRegex)!=null;}
function validateFederationAddress(federationAddress){if(!federationAddress){return false;};if(federationAddress.indexOf('*')<0){return false;};federationAddress=federationAddress.split('*')
if(federationAddress.length>2){return false;};if(!federationAddress[0]){return false;};let isValidDomain=validateDomain(federationAddress[1]);if(federationAddress[1]&&isValidDomain){return true;};return false;};;"use strict";$(function(){$('.input-group > .form-control').on('focus',function(){$(this).parent().addClass('focused');}).on('blur',function(){$(this).parent().removeClass('focused');});});;"use strict";function escapeHtml(html){return document.createElement('div').appendChild(document.createTextNode(html)).parentNode.innerHTML;}
var onSubmitSearchAssetFormError=function(){$nonFieldErrors=$('#id-search-asset-form').find('.non-field-errors');var $errorList=$nonFieldErrors.find('ul');if(!$errorList[0]){$errorList=$('<ul></ul>');$nonFieldErrors.append($errorList);}
$errorList.append('<li>'+gettext('Invalid request, please try again latter.')+'</li>');$nonFieldErrors.removeClass('hidden');}
var onSubmitListingFormError=function(){$nonFieldErrors=$('#id-asset-listing-form').find('.non-field-errors');var $errorList=$nonFieldErrors.find('ul');if(!$errorList[0]){$errorList=$('<ul></ul>');$nonFieldErrors.append($errorList);}
$errorList.append('<li>'+gettext('Invalid request, please try again latter.')+'</li>');$nonFieldErrors.removeClass('hidden');}
var onSubmitSearchAssetForm=function(token){var $form=$('#id-search-asset-form');var $submitButton=$form.find('button');$submitButton.prop('disabled',true);var showAssetsNotFoundBlock=function(message){$('.not-found-state').find('.description').text(message);$('.assets-container').addClass('hidden');$('.not-found-state').removeClass('hidden');$(".assets-list").removeClass("hidden");}
var setupAssetTipsBlock=function(){$('.not-found-by-issuer-or-code').removeClass('hidden');$('.not-found-by-domain').addClass('hidden');}
var setupDomainTipsBlock=function(){$('.not-found-by-issuer-or-code').addClass('hidden');$('.not-found-by-domain').removeClass('hidden');}
var handleAssetsNotFoundBlock=function(query){var message=gettext("'{0}' is not a valid asset code or domain.").format(query);var isValidAssetCode=validateAssetCode(query);if(isValidAssetCode){message=gettext("No assets available on LOBSTR when searching by '{0}' code.").format(query);setupAssetTipsBlock();showAssetsNotFoundBlock(message);return;}
var isValidDomain=validateDomain(query);var isValidURL=validateURL(query);if(isValidDomain){var url=$('.toml-check').attr('data-toml-check-url');$('.toml-check').attr('href',url+query);}
if(isValidDomain||isValidURL){message=gettext("No assets available on LOBSTR when searching by '{0}' domain.").format(query);setupDomainTipsBlock();showAssetsNotFoundBlock(message);return;}
var isValidAccountIdPattern=validateAccountIdPattern(query);if(isValidAccountIdPattern){message=gettext("No assets available on LOBSTR when searching by '{0}' issuer.").format(humanizeAddress(query));setupAssetTipsBlock();showAssetsNotFoundBlock(message);return;}
setupAssetTipsBlock();showAssetsNotFoundBlock(message);}
var initializeAssetImageClick=function(){var selector=$('.asset-wrapper .asset-info-cell .asset-info-cell-name, '+'.asset-wrapper .asset-info-cell .asset-info-cell-image-wrapper, '+'.asset-wrapper .asset-action-link');selector.unbind('click');selector.on('click',function(event){if(!$(this).closest('.asset-wrapper').hasClass('no-popup')){$(this).closest('.asset-wrapper').addClass('active-row');$('#asset-details').modal('show');}});};var showFoundedAssetsBlock=function(assets,header){var html=Handlebars.templates._light_assets_list_block({'asset_balances':assets,'header':header,});$('.assets-container').html(html);initializeAssetImageClick();$(document).trigger('fill-icon-fillers');$('.not-found-state').addClass('hidden');$('.assets-container').removeClass("hidden");$(".assets-list").removeClass("hidden");$('#id-search-asset-form').find('button').removeClass('disabled');}
var handleFoundedAssetsBlock=function(data,query){query=escapeHtml(query);var assets=data.results;var header=gettext("Assets found by '{0}' code").format(query);if(!assets||assets.length==0){return handleAssetsNotFoundBlock(query);}
var isValidAssetCode=validateAssetCode(query);if(isValidAssetCode){header=gettext("Assets found by '{0}' code").format(query);setupAssetTipsBlock();showFoundedAssetsBlock(assets,header);return;}
var isValidDomain=validateDomain(query);var isValidURL=validateURL(query);if(isValidDomain){var url=$('.toml-check').attr('data-toml-check-url');$('.toml-check').attr('href',url+query);}
if(isValidDomain||isValidURL){header=gettext("Assets listed by '{0}' domain".format(query));setupDomainTipsBlock();showFoundedAssetsBlock(assets,header);return;}
var isValidAccountIdPattern=validateAccountIdPattern(query);if(isValidAccountIdPattern){header=gettext("Assets issued by '{0}'").format(humanizeAddress(query));setupAssetTipsBlock();showFoundedAssetsBlock(assets,header);return;}
setupAssetTipsBlock();showFoundedAssetsBlock(assets,header);};$form.find('.captcha-result').val(token);var query=$form.find('#id_query').val().trim();$.ajax({type:"POST",url:$form.attr('action')+'?search='+query,data:$form.serialize(),beforeSend:beforeSendCSRFConfig($form.find('[name="csrfmiddlewaretoken"]').val())}).done(function(data){hideFormErrorsV2($form);handleFoundedAssetsBlock(data,query);}).fail(function(xhr,textStatus){var response=xhr.responseJSON;showFormErrorsV2($form,response);}).always(function(){grecaptcha.reset(0);$submitButton.prop('disabled',false);});}
var onSubmitRequestAssetListingForm=function(token){var $form=$('#id-asset-listing-form');var $submitButton=$form.find('button');var $resultModal=$("#result-modal");var $assetListingModal=$('#asset-listing-modal');$submitButton.prop('disabled',true);$form.find('.captcha-result').val(token);$.ajax({type:"POST",url:$form.attr('action'),data:$form.serialize(),beforeSend:beforeSendCSRFConfig($form.find('[name="csrfmiddlewaretoken"]').val())}).done(function(data){$("#result-body").html(Handlebars.templates.result_popup_content({title:gettext("Thank you!"),description:gettext("Your application has been received!"),}));$assetListingModal.modal('hide');$resultModal.modal("show");$resultModal.find('input').focus();lottie.loadAnimation({container:$resultModal.find('.result-animation')[0],renderer:'svg',loop:false,autoplay:true,path:$('#confirm-animation-url').attr('data-value')});$form.trigger("reset");}).fail(function(xhr,textStatus){var response=xhr.responseJSON;showFormErrorsV2($form,response);}).always(function(){grecaptcha.reset(1);$submitButton.prop('disabled',false);});}
$(function(){$('#asset-details').on('hidden.bs.modal',function(){$(this).find('.modal-content.popup-content').html('');});$('#asset-details').on('show.bs.modal',function(){$(this).focus();var $row=$('.active-row');var show_deposit_button=$row.attr('data-deposit_enabled')&&$row.attr('data-deposit_enabled')!=="false",show_withdraw_button=$row.attr('data-withdraw_enabled')&&$row.attr('data-withdraw_enabled')!=="false"&&$row.attr('data-raw_amount')>0,show_transfer_history_button=!!$row.attr('data-transfer_history_url');var html=Handlebars.templates._light_asset_details_popup({'id':$row.attr('data-asset-id'),'name':$row.attr('data-name'),'code':$row.attr('data-asset-code'),'first_letter':($row.attr('data-name')||$row.attr('data-asset-code'))[0],'icon':$row.attr('data-icon'),'home_domain':$row.attr('data-home_domain'),'custom_description':$row.attr('data-custom_description'),'issuer':$row.attr('data-asset-issuer'),'description':$row.attr('data-description'),'conditions':$row.attr('data-conditions'),'background_color':$row.attr('data-background_color'),'close_icon_url':$('#close-icon-url').attr('data-value'),});$row.removeClass('active-row');$(this).find('.modal-content.popup-content').html(html);$('.asset-info-header-image-wrapper img').on('error',assetFillerErrorEventHandler);$(document).trigger('fill-icon-fillers');});$('#id-search-asset-button').on('click',function(event){event.preventDefault();var $form=$(this).closest('form');if(!$form[0].reportValidity()){return;}
var query=$form.find('#id_query').val().trim();if(!query){$('.not-found-state').addClass('hidden');$('.assets-container').addClass("hidden");$(".assets-list").addClass("hidden");return;}
var isValidAssetCode=validateAssetCode(query);var isValidDomain=validateDomain(query);var isValidURL=validateURL(query);var isValidAccountIdPattern=validateAccountIdPattern(query);if(!isValidAssetCode&&!isValidDomain&&!isValidURL&&!isValidAccountIdPattern){query=escapeHtml(query);var message=gettext("'{0}' is not a valid asset code or domain.").format(query);$('.not-found-state').find('.description').text(message);$('.assets-container').addClass('hidden');$('.not-found-state').removeClass('hidden');$(".assets-list").removeClass("hidden");return;}
grecaptcha.execute(0);});$('#id-request-asset-listing-button').on('click',function(event){event.preventDefault();var $form=$(this).closest('form');if(!$form[0].reportValidity()){return;}
grecaptcha.execute(1);});$('#id-asset-listing-form').find('input').on('input',function(){hideInputErrorV2($(this));});});;var showErrors=function($form,response){hideErrors($form);var errors=null;if(response){errors=response.errors;}
if(!errors){errors=response;}
if(!errors){showFormErrorsV2($form,{'detail':gettext('Something went wrong.')});return;}
for(var fieldName in errors){var $field=$form.find('[name="'+fieldName+'"]');if($field.length>0&&errors[fieldName]){$field.addClass('is-invalid invalid');$field.closest('.form-group').addClass('has-error');for(var i=0,error;error=errors[fieldName][i];i++){$field.parent().append('<span class="error-message invalid-feedback">'+error+'</span>');}}}
var extraFields=['non_field_errors','detail','__all__'],$nonFieldErrors=$form.find('.non-field-errors');for(var i=0,error;i<extraFields.length;i++){error=errors[extraFields[i]];if(error){var $errorList=$nonFieldErrors.find('ul');if(!$errorList[0]){$errorList=$('<ul></ul>');$nonFieldErrors.append($errorList);}
$nonFieldErrors.removeClass('hidden');$errorList.append('<li>'+error+'</li>');}}};var showFormErrorsV2=function($form,response){hideFormErrorsV2($form);var errors=null;if(response){errors=response.errors;}
if(!errors){errors=response;}
if(!errors){showFormErrorsV2($form,{'detail':gettext('Something went wrong.')});return;}
window.test=errors;for(var fieldName in errors){var $field=$form.find('[name="'+fieldName+'"]');if($field.length>0&&errors[fieldName]){$field.addClass('is-invalid');var $formGroup=$field.closest('.form-group');$formGroup.addClass('has-error');for(var i=0,error;error=errors[fieldName][i];i++){$formGroup.find('.field-bottom-group').append('<span class="form-text help-text invalid-feedback">'+error+'</span>')}}}
var extraFields=['non_field_errors','detail','__all__'],$nonFieldErrors=$form.find('.non-field-errors');for(var i=0,error;i<extraFields.length;i++){error=errors[extraFields[i]];if(error){var $errorList=$nonFieldErrors.find('ul');if(!$errorList[0]){$errorList=$('<ul></ul>');$nonFieldErrors.append($errorList);}
$errorList.append('<li>'+error+'</li>');$nonFieldErrors.removeClass('hidden');}}}
var hideFormErrorsV2=function($form){$form.find('.non-field-errors').html('').addClass('hidden');$form.removeClass('has-error').find('.form-group').removeClass('has-error').find('.is-invalid').removeClass('is-invalid').find('.invalid-feedback').remove();}
var hideInputErrorV2=function($input){$input.removeClass('is-invalid').closest('.form-group').removeClass('has-error').find('.invalid-feedback').remove();}
var hideErrors=function($form){$form.find('.non-field-errors').html('').addClass('hidden');$form.find('.is-invalid').removeClass('is-invalid invalid');$form.find('.has-error').removeClass('has-error');$form.find('.error-message, .invalid-feedback').remove();};var hideInputFieldErrors=function($inputField){$inputField.closest('.has-error').removeClass('has-error');$inputField.removeClass('is-invalid invalid');};(function(){var template=Handlebars.template,templates=Handlebars.templates=Handlebars.templates||{};templates['result_popup_content']=template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data){var helper,alias1=depth0!=null?depth0:{},alias2=helpers.helperMissing,alias3="function",alias4=container.escapeExpression;return"<div class=\"result-animation\"></div>\n<div class=\"title\">"
+alias4(((helper=(helper=helpers.title||(depth0!=null?depth0.title:depth0))!=null?helper:alias2),(typeof helper===alias3?helper.call(alias1,{"name":"title","hash":{},"data":data}):helper)))
+"</div>\n<div class=\"description\">"
+alias4(((helper=(helper=helpers.description||(depth0!=null?depth0.description:depth0))!=null?helper:alias2),(typeof helper===alias3?helper.call(alias1,{"name":"description","hash":{},"data":data}):helper)))
+"</div>";},"useData":true});})();;(function(){var template=Handlebars.template,templates=Handlebars.templates=Handlebars.templates||{};templates['_light_assets_list_block']=template({"1":function(container,depth0,helpers,partials,data){var stack1,alias1=depth0!=null?depth0:{},alias2=container.lambda,alias3=container.escapeExpression;return"    <div class=\"data asset-wrapper "
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.is_native:depth0),{"name":"if","hash":{},"fn":container.program(2,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\"\n         data-asset-id=\""
+alias3(alias2((depth0!=null?depth0.id:depth0),depth0))
+"\"\n         data-icon=\""
+alias3(alias2((depth0!=null?depth0.icon:depth0),depth0))
+"\"\n         data-name=\""
+alias3(alias2((depth0!=null?depth0.name:depth0),depth0))
+"\"\n         data-asset-code=\""
+alias3(alias2((depth0!=null?depth0.code:depth0),depth0))
+"\"\n         data-raw_amount=\""
+alias3(alias2((depth0!=null?depth0.raw_amount:depth0),depth0))
+"\"\n         data-home_domain=\""
+alias3(alias2((depth0!=null?depth0.home_domain:depth0),depth0))
+"\"\n         data-asset-issuer=\""
+alias3(alias2((depth0!=null?depth0.issuer:depth0),depth0))
+"\"\n         data-description=\""
+alias3(alias2((depth0!=null?depth0.description:depth0),depth0))
+"\"\n         data-conditions=\""
+alias3(alias2((depth0!=null?depth0.conditions:depth0),depth0))
+"\"\n         data-is_native=\""
+alias3(alias2((depth0!=null?depth0.is_native:depth0),depth0))
+"\"\n         data-background_color=\""
+alias3(alias2((depth0!=null?depth0.background_color:depth0),depth0))
+"\"\n         data-custom_description=\""
+alias3(alias2((depth0!=null?depth0.custom_description:depth0),depth0))
+"\">\n        <div class=\"asset-info-cell "
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.home_domain:depth0),{"name":"if","hash":{},"fn":container.program(4,data,0),"inverse":container.program(6,data,0),"data":data}))!=null?stack1:"")
+"\">\n            <div class=\"asset-info-cell-image-wrapper\">\n"
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.icon:depth0),{"name":"if","hash":{},"fn":container.program(8,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\n                <div class=\"icon-filler "
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.icon:depth0),{"name":"if","hash":{},"fn":container.program(10,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\" data-color=\""
+alias3(alias2((depth0!=null?depth0.background_color:depth0),depth0))
+"\">\n"
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.name:depth0),{"name":"if","hash":{},"fn":container.program(12,data,0),"inverse":container.program(14,data,0),"data":data}))!=null?stack1:"")
+"                </div>\n            </div>\n            <div class=\"asset-info-cell-name\">\n"
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.name:depth0),{"name":"if","hash":{},"fn":container.program(16,data,0),"inverse":container.program(18,data,0),"data":data}))!=null?stack1:"")
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.home_domain:depth0),{"name":"if","hash":{},"fn":container.program(20,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"            </div>\n        </div>\n\n        <div>\n            <a data-url=\"\" class=\"new-button grey asset-action-link ignore\">"
+alias3((helpers._||(depth0&&depth0._)||helpers.helperMissing).call(alias1,"View details",{"name":"_","hash":{},"data":data}))
+"</a>\n        </div>\n    </div>\n";},"2":function(container,depth0,helpers,partials,data){return"no-popup";},"4":function(container,depth0,helpers,partials,data){return"";},"6":function(container,depth0,helpers,partials,data){return"align-items-center";},"8":function(container,depth0,helpers,partials,data){return"                    <img src=\""
+container.escapeExpression(container.lambda((depth0!=null?depth0.icon:depth0),depth0))
+"\">\n";},"10":function(container,depth0,helpers,partials,data){return"hidden";},"12":function(container,depth0,helpers,partials,data){var stack1;return"                        "
+((stack1=(helpers.first_letter||(depth0&&depth0.first_letter)||helpers.helperMissing).call(depth0!=null?depth0:{},(depth0!=null?depth0.name:depth0),{"name":"first_letter","hash":{},"fn":container.program(4,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\n";},"14":function(container,depth0,helpers,partials,data){var stack1;return"                        "
+((stack1=(helpers.first_letter||(depth0&&depth0.first_letter)||helpers.helperMissing).call(depth0!=null?depth0:{},(depth0!=null?depth0.code:depth0),{"name":"first_letter","hash":{},"fn":container.program(4,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\n";},"16":function(container,depth0,helpers,partials,data){var alias1=container.lambda,alias2=container.escapeExpression;return"                    "
+alias2(alias1((depth0!=null?depth0.name:depth0),depth0))
+" <span class=\"code\"> ("
+alias2(alias1((depth0!=null?depth0.code:depth0),depth0))
+") </span>\n";},"18":function(container,depth0,helpers,partials,data){var alias1=container.lambda,alias2=container.escapeExpression;return"                    "
+alias2(alias1((depth0!=null?depth0.code:depth0),depth0))
+" <span class=\"code\"> ("
+alias2(alias1((depth0!=null?depth0.code:depth0),depth0))
+") </span>\n";},"20":function(container,depth0,helpers,partials,data){return"                    <div class=\"home-domain asset-list-home-domain\">\n                        <span> "
+container.escapeExpression(container.lambda((depth0!=null?depth0.home_domain:depth0),depth0))
+" </span>\n                    </div>\n";},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data){var stack1,helper,alias1=depth0!=null?depth0:{};return"<h2>"
+container.escapeExpression(((helper=(helper=helpers.header||(depth0!=null?depth0.header:depth0))!=null?helper:helpers.helperMissing),(typeof helper==="function"?helper.call(alias1,{"name":"header","hash":{},"data":data}):helper)))
+"</h2>\n\n"
+((stack1=helpers.each.call(alias1,(depth0!=null?depth0.asset_balances:depth0),{"name":"each","hash":{},"fn":container.program(1,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"");},"useData":true});})();;(function(){var template=Handlebars.template,templates=Handlebars.templates=Handlebars.templates||{};templates['_light_asset_details_popup']=template({"1":function(container,depth0,helpers,partials,data){return"                <img src=\""
+container.escapeExpression(container.lambda((depth0!=null?depth0.icon:depth0),depth0))
+"\">\n";},"3":function(container,depth0,helpers,partials,data){return"hidden";},"5":function(container,depth0,helpers,partials,data){var stack1;return"                    "
+((stack1=(helpers.first_letter||(depth0&&depth0.first_letter)||helpers.helperMissing).call(depth0!=null?depth0:{},(depth0!=null?depth0.name:depth0),{"name":"first_letter","hash":{},"fn":container.program(6,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\n";},"6":function(container,depth0,helpers,partials,data){return"";},"8":function(container,depth0,helpers,partials,data){var stack1;return"                    "
+((stack1=(helpers.first_letter||(depth0&&depth0.first_letter)||helpers.helperMissing).call(depth0!=null?depth0:{},(depth0!=null?depth0.code:depth0),{"name":"first_letter","hash":{},"fn":container.program(6,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\n";},"10":function(container,depth0,helpers,partials,data){var helper;return"                "
+container.escapeExpression(((helper=(helper=helpers.name||(depth0!=null?depth0.name:depth0))!=null?helper:helpers.helperMissing),(typeof helper==="function"?helper.call(depth0!=null?depth0:{},{"name":"name","hash":{},"data":data}):helper)))
+"\n";},"12":function(container,depth0,helpers,partials,data){var helper;return"                "
+container.escapeExpression(((helper=(helper=helpers.code||(depth0!=null?depth0.code:depth0))!=null?helper:helpers.helperMissing),(typeof helper==="function"?helper.call(depth0!=null?depth0:{},{"name":"code","hash":{},"data":data}):helper)))
+"\n";},"14":function(container,depth0,helpers,partials,data){var helper,alias1=depth0!=null?depth0:{},alias2=helpers.helperMissing,alias3="function",alias4=container.escapeExpression;return"                <span class=\"code\">\n                    ("
+alias4(((helper=(helper=helpers.code||(depth0!=null?depth0.code:depth0))!=null?helper:alias2),(typeof helper===alias3?helper.call(alias1,{"name":"code","hash":{},"data":data}):helper)))
+")\n                </span>\n                <div class=\"home-domain\">\n                    <a href=\"https://"
+alias4(((helper=(helper=helpers.home_domain||(depth0!=null?depth0.home_domain:depth0))!=null?helper:alias2),(typeof helper===alias3?helper.call(alias1,{"name":"home_domain","hash":{},"data":data}):helper)))
+"\" target=\"_blank\">"
+alias4(((helper=(helper=helpers.home_domain||(depth0!=null?depth0.home_domain:depth0))!=null?helper:alias2),(typeof helper===alias3?helper.call(alias1,{"name":"home_domain","hash":{},"data":data}):helper)))
+"</a>\n                </div>\n";},"16":function(container,depth0,helpers,partials,data){var stack1;return((stack1=helpers["if"].call(depth0!=null?depth0:{},(depth0!=null?depth0.name:depth0),{"name":"if","hash":{},"fn":container.program(17,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"");},"17":function(container,depth0,helpers,partials,data){var helper;return"                    <div class=\"code\">\n                        ("
+container.escapeExpression(((helper=(helper=helpers.code||(depth0!=null?depth0.code:depth0))!=null?helper:helpers.helperMissing),(typeof helper==="function"?helper.call(depth0!=null?depth0:{},{"name":"code","hash":{},"data":data}):helper)))
+")\n                    </div>\n";},"19":function(container,depth0,helpers,partials,data){var helper;return"        <div class=\"asset-custom-description\">\n            "
+container.escapeExpression(((helper=(helper=helpers.custom_description||(depth0!=null?depth0.custom_description:depth0))!=null?helper:helpers.helperMissing),(typeof helper==="function"?helper.call(depth0!=null?depth0:{},{"name":"custom_description","hash":{},"data":data}):helper)))
+"\n        </div>\n";},"21":function(container,depth0,helpers,partials,data){var stack1;return((stack1=helpers["if"].call(depth0!=null?depth0:{},(depth0!=null?depth0.description:depth0),{"name":"if","hash":{},"fn":container.program(22,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"");},"22":function(container,depth0,helpers,partials,data){var helper;return"        <div class=\"asset-custom-description\">\n            "
+container.escapeExpression(((helper=(helper=helpers.description||(depth0!=null?depth0.description:depth0))!=null?helper:helpers.helperMissing),(typeof helper==="function"?helper.call(depth0!=null?depth0:{},{"name":"description","hash":{},"data":data}):helper)))
+"\n        </div>\n    ";},"24":function(container,depth0,helpers,partials,data){var helper,alias1=depth0!=null?depth0:{},alias2=helpers.helperMissing,alias3=container.escapeExpression;return"        <div class=\"popup-row\">\n            <div class=\"name\">\n                "
+alias3((helpers._||(depth0&&depth0._)||alias2).call(alias1,"Issuer",{"name":"_","hash":{},"data":data}))
+"\n            </div>\n            "
+alias3(((helper=(helper=helpers.issuer||(depth0!=null?depth0.issuer:depth0))!=null?helper:alias2),(typeof helper==="function"?helper.call(alias1,{"name":"issuer","hash":{},"data":data}):helper)))
+"\n        </div>\n";},"26":function(container,depth0,helpers,partials,data){var helper,alias1=depth0!=null?depth0:{},alias2=helpers.helperMissing,alias3=container.escapeExpression;return"        <div class=\"popup-row\">\n            <div class=\"name\">\n                "
+alias3((helpers._||(depth0&&depth0._)||alias2).call(alias1,"Conditions",{"name":"_","hash":{},"data":data}))
+"\n            </div>\n            "
+alias3(((helper=(helper=helpers.conditions||(depth0!=null?depth0.conditions:depth0))!=null?helper:alias2),(typeof helper==="function"?helper.call(alias1,{"name":"conditions","hash":{},"data":data}):helper)))
+"\n        </div>\n";},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data){var stack1,helper,alias1=depth0!=null?depth0:{},alias2=helpers.helperMissing,alias3="function",alias4=container.escapeExpression;return"<button class=\"close-popup close-popup-button close\" type=\"button\" data-dismiss=\"modal\">\n    <button class=\"close-popup close-popup-button close\" type=\"button\" data-dismiss=\"modal\">\n        <img src=\""
+alias4(((helper=(helper=helpers.close_icon_url||(depth0!=null?depth0.close_icon_url:depth0))!=null?helper:alias2),(typeof helper===alias3?helper.call(alias1,{"name":"close_icon_url","hash":{},"data":data}):helper)))
+"\">\n    </button>\n</button>\n<div class=\"asset-info\" data-asset-code=\""
+alias4(((helper=(helper=helpers.code||(depth0!=null?depth0.code:depth0))!=null?helper:alias2),(typeof helper===alias3?helper.call(alias1,{"name":"code","hash":{},"data":data}):helper)))
+"\" data-asset-issuer=\""
+alias4(((helper=(helper=helpers.issuer||(depth0!=null?depth0.issuer:depth0))!=null?helper:alias2),(typeof helper===alias3?helper.call(alias1,{"name":"issuer","hash":{},"data":data}):helper)))
+"\">\n    <div class=\"asset-info-header\">\n        <div class=\"asset-info-header-image-wrapper\">\n"
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.icon:depth0),{"name":"if","hash":{},"fn":container.program(1,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\n            <div class=\"icon-filler "
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.icon:depth0),{"name":"if","hash":{},"fn":container.program(3,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\" data-color=\""
+alias4(((helper=(helper=helpers.background_color||(depth0!=null?depth0.background_color:depth0))!=null?helper:alias2),(typeof helper===alias3?helper.call(alias1,{"name":"background_color","hash":{},"data":data}):helper)))
+"\">\n"
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.name:depth0),{"name":"if","hash":{},"fn":container.program(5,data,0),"inverse":container.program(8,data,0),"data":data}))!=null?stack1:"")
+"            </div>\n        </div>\n        <div class=\"asset-info-header-name\">\n"
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.name:depth0),{"name":"if","hash":{},"fn":container.program(10,data,0),"inverse":container.program(12,data,0),"data":data}))!=null?stack1:"")
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.home_domain:depth0),{"name":"if","hash":{},"fn":container.program(14,data,0),"inverse":container.program(16,data,0),"data":data}))!=null?stack1:"")
+"        </div>\n    </div>\n\n"
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.custom_description:depth0),{"name":"if","hash":{},"fn":container.program(19,data,0),"inverse":container.program(21,data,0),"data":data}))!=null?stack1:"")
+"\n"
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.issuer:depth0),{"name":"if","hash":{},"fn":container.program(24,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"\n"
+((stack1=helpers["if"].call(alias1,(depth0!=null?depth0.conditions:depth0),{"name":"if","hash":{},"fn":container.program(26,data,0),"inverse":container.noop,"data":data}))!=null?stack1:"")
+"</div>\n";},"useData":true});})();;