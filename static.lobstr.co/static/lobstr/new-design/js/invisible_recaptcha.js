"use strict";(function(){window.onCaptchaLoad=function(){var captchaFields=document.getElementsByClassName('g-recaptcha');for(var i=0;i<captchaFields.length;i++){var container=captchaFields[i];if(container.childNodes.length>0)continue;var widgetId=grecaptcha.render(container.id);container.childNodes[0].style['bottom']='67px';var form=container;while((form=form.parentElement)&&(form.tagName.toLowerCase()!='form'));(function(widgetId){form.addEventListener("submit",function(event){if(!this.captched&&!event.defaultPrevented){event.preventDefault();grecaptcha.execute(widgetId);}});})(widgetId);var callbackName=container.dataset&&container.dataset.callback||container.getAttribute('data-callback');(function(container){window[callbackName]=function(){var captcha_field=container.getElementsByTagName('textarea')[0],form=captcha_field.form,submitBtn=form.querySelector('[type="submit"]');form.captched=true;submitBtn.click();}})(container);}}})();