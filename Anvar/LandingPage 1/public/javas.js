window.onload = function(){
	document.addEventListener('click', clickFun);

	function clickFun(event)
	{
		//console.log(event.target);
		if(event.target.getAttribute('class') == "btn")
		{
			alert("Нажали кнопку!");			
		}
		else if(event.target.getAttribute('id') == "submit_btn")
		{
				var name = document.getElementById("name").value;
				var email = document.getElementById("email").value; 

				if(name.length > 0 && email.length>0)
				{
					if(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i.test(email))
					{
						//Отправка post
						ajaxPost("name=" + name + "&&email="+email);
					}
					else
					{
						document.getElementById("valid").innerHTML = 'Неверный email!';
					}
				}
				else
				{
					document.getElementById("valid").innerHTML = 'Пожалуйста, заполните все поля!';
				}
		}
	}
}

function ajaxPost(params)
{
	var req = new XMLHttpRequest();

	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200)
		{
			if(req.responseText == 'Аутентификация пройдена!')
			{
				document.getElementById("valid").style.color = 'green';
			}
			document.getElementById("valid").innerHTML = req.responseText;
			document.getElementById("name").value = "";
			document.getElementById("email").value = "";
		}
	}

	req.open('POST','/LandingPage');
	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	req.send(params);

}