  var Pic = new Array()
  Pic[0] = 'pic2.gif'
  Pic[1] = 'pic4.gif'
  Pic[2] = 'pic1.gif'
  var slideIndex = 1;
  var old=0;
showSlidesFirst(slideIndex)
function plusSlides(n) {
  showSlides(slideIndex += n);
}
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var img1 = document.getElementsByClassName("block1");
  var img2 = document.getElementsByClassName("block2");
  var img3 = document.getElementsByClassName("block3");
  var img4 = document.getElementsByClassName("block4");
  if (n > slides.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none"; 
      img1[i].style.backgroundImage = 'url('+Pic[old]+')';
      img2[i].style.backgroundImage = 'url('+Pic[old]+')';
      img3[i].style.backgroundImage = 'url('+Pic[old]+')';
      img4[i].style.backgroundImage = 'url('+Pic[old]+')';
  }
  slides[slideIndex-1].style.display = "block"; 
  Move(slideIndex-1,img1,img2,img3,img4);
}
 function Move(n,im1,im2,im3,im4){
    im1[n].style.backgroundImage = 'url('+Pic[n]+')';
     setTimeout(function(){
    im2[n].style.backgroundImage = 'url('+Pic[n]+')';
     },100)
     setTimeout(function(){
    im3[n].style.backgroundImage = 'url('+Pic[n]+')';
     },200)
     setTimeout(function(){
    im4[n].style.backgroundImage = 'url('+Pic[n]+')';
     },300)
     old=n
    }
  function showSlidesFirst(n) {
  var i;
  console.log(n)
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none"; 
  }
  slides[slideIndex-1].style.display = "block"; 
}
