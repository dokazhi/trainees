window.onload = function()
{
	document.querySelector('.MyList').addEventListener('click',mainClick);

	function mainClick(event)
	{
		if(event.target.id != 'MyList' && event.target.id == 'MyWrapper')
		{
			document.getElementById('MyWrapper').style.display = 'none';
		}
	};

	document.querySelector('#nav').addEventListener('click',Clickbtn);

	function Clickbtn(event)
	{
		if(event.target.id == 'showLi')
		{
			//something with ajax
			document.getElementById('MyWrapper').style.display = 'block';
		}
	};

};
