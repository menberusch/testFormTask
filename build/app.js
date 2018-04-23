(function(){
// RegeEx
const nameRe = /^[a-zA-Z\s]+$/,
      emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Variables
var uploadImage = $('#uploadImage'),
    reqElems = $('[required]'),
    issueImage = $('#issueImage'),
    sendBtn = $('#sendData'),
    exampleBtn = $('#exampleBtn'),
    imgData,

    reqFields = [].slice.call(document.querySelectorAll('[required]'));


// validation functions

function nameValidator(nameVal) {
  return nameRe.test(nameVal); 
}

function emailValidator(email) {
  var validEmailObj = {
    provider: false,
    valid: false
  };

  if(email.includes('@gmail.com') || email.includes('@outlook.com')){
    validEmailObj.provider = true;
    if(emailRe.test(email)) {
      validEmailObj.valid = true;
    }
  }

  return validEmailObj;
}

function descValidator(desc) {
  if(desc.length >= 5 && desc.length <= 300) {
    return true;
  }
  return false;
}

function formValidation() {
  var nameValue = $('#nameInput').val(),
      issueSelect = $('#issueSelect').val(),
      emailValue = $('#emailInput').val(),
      issueDesc = $('#issueDesc').val(),

      formInvalidMsg = [],
      formValidObj = {};

  if (!nameValidator(nameValue)) {
    formInvalidMsg.push('Provided name is invalid. Make sure you are using only letters and spaces.');
  } else {
    formValidObj.userName = nameValue;  
  };

  if (!emailValidator(emailValue).provider) {
    formInvalidMsg.push('Provided email is invalid. Make sure your email provider is @gmail.com or @outlook.com.');
  } else if (!emailValidator(emailValue).valid) {
    formInvalidMsg.push('Provided email is invalid. You are using not allowed symbols.');
  } else {
    formValidObj.userEmail = emailValue;
  };

  if (!descValidator(issueDesc)) {
    formInvalidMsg.push('Provided description is invalid. Make sure your issue description has more than 5 and less than 300 characters.')
  } else {
    formValidObj.issueDescription = issueDesc; 
  }

  if(formInvalidMsg.length === 0) {
    formValidObj.issueType = issueSelect;
    if (imgData) formValidObj.issue_image = imgData;
    return formValidObj;
  }
  
  return formInvalidMsg;
}


// events

uploadImage.change(function () {

  issueImage.parent().css('opacity', '1');
  if (this.files && this.files[0]) {

    var reader = new FileReader();

    reader.onload = function (e) {
      imgData = e.target.result;
      issueImage.attr('src', imgData);
    };

    reader.readAsDataURL(this.files[0]);
  }

});

$('button[type="reset"]').click(function () {
  issueImage.parent().css('opacity', '0');
  issueImage[0].src = '';
});

exampleBtn.click(function(){
  $('#nameInput').attr('placeholder', 'Nice Name');
  $('#emailInput').attr('placeholder', 'example@gmail.com');
  $('#issueDesc').attr('placeholder', "Hello this is my nice issue describing.");
}); 

reqElems.on('change keyup', (function() {
  if(reqFields.every(val => val.value !== '')) {
    sendBtn.removeAttr('disabled');
  } else { 
    sendBtn.attr('disabled', '');
  }
}));

$('#sendData').click(function() {

  var validationResult = formValidation();

  if(Array.isArray(validationResult)) {

    alert(validationResult.join('\n'));

  } else {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(validationResult),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(data => alert('Your data was sended sucessfully!\n' + JSON.stringify(data, null, 2)))
    .catch(function (err) {
      alert(err);
    });
  }
});

}());