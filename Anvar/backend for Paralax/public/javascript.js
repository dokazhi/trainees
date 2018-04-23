window.onload = function()
{
	document.querySelector(".main").addEventListener('click',mainClick);

	function mainClick(event)
	{
		if(event.target.id == 'btn_submit')
		{
			event.preventDefault();

			var file = document.getElementById('file').files[0];
			var firstname = document.getElementById('firstname').value;
			var lastname = document.getElementById('lastname').value;
			var comments = document.getElementById('comments').value;

			if(firstname == '' || lastname == '' || comments == '' || file == undefined)
			{
				alert("Пожалуйста, заполните все поля!\nИ загрузите файл!");
			}
			else
			{
				
				var chb_d = document.getElementById('chb_d').checked;
				var chb_e = document.getElementById('chb_e').checked;
				var chb_fc = document.getElementById('chb_fc').checked;

				var date = new Date();
				var fname = './public/Resumes/' + date.getDate()+'.' +date.getMonth()+'.'+ date.getFullYear()+ '-' + file.name;
				var req = new XMLHttpRequest();

				req.onreadystatechange = function()
				{
					if(req.readyState == 4 && req.status == 200)
					{
							var data = new FormData();
					        //Добавлем туда файл
					        data.append('uploadFile', file);

					        $.ajax({
				            url: '/About_file',
				            data: data,
				            cache: false,
				            contentType: false,
				            processData: false,
				            type: 'POST',
				            success: function(response) {
				            	top.location.href = '/Index';
				            }
							});
					}
				}

				req.open('POST','/About_Parallax', true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.send('firstname='+firstname+'&&lastname='+lastname+'&&chb_d='+chb_d+'&&chb_e='+chb_e + '&&chb_fc='+chb_fc+'&&comments='+comments + '&&filename='+fname);
			}
		}
	};
};
