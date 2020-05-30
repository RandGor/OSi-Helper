function init(){
	authorbox = document.getElementById("author");    
	timebox = document.getElementById("time");    
	messagebox = document.getElementById("message");    
	maximizebox = document.getElementById("maximize");    
	downloaderbox = document.getElementById("downloader");    
	
	maximizebox.onclick = function() {window.open(maximizebox.href,'_blank');}
  
    const req = new XMLHttpRequest();
    const baseUrl = "http://moodle.ami.nstu.ru/mod/assign/view.php?id=904&action=view";
    const urlParams = "";
	
    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    req.onreadystatechange = function() { // Call a function when the state changes. 
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			doc2 = this.responseText;
			if(doc2.includes("<title>Moodle НГТУ: Вход на сайт</title>")){
				maximizebox.click();
			}else{
				pull();
			}
        }
    }
    req.send(urlParams);
}
function pull(){
	sesskey = doc2.match(/("sesskey":).*(,"loadingicon")/gs)[0].match(/:".*",/gs)[0].replace(":\"","").replace("\",","");
	clientid = doc2.match(/({"client_id":").*(","commentarea")/gs)[0].replace("{\"client_id\":\"","").replace("\",\"commentarea\"","");
	itemid = doc2.match(/("itemid":").*(","page")/gs)[0].replace("\"itemid\":\"","").replace("\",\"page\"","");
	dochtml = doc2.match(/(Отзыв в виде файла).*?(\/div)/gs)[0].match(/(<div>).*?(\/div)/gs)[0];
	
    const req = new XMLHttpRequest();
    const baseUrl = "http://moodle.ami.nstu.ru/comment/comment_ajax.php"
    const urlParams = "sesskey="+sesskey+"&action=get&client_id="+clientid+"&itemid="+itemid+"&area=submission_comments&courseid=23&contextid=4290&component=assignsubmission_comments";

    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    req.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			workwithJSON(this.responseText);
        }
    }
    req.send(urlParams);
}

function workwithJSON(json){
	lastmessage = JSON.parse(json).list[0]
	authorbox.innerHTML = lastmessage.fullname;
	timebox.innerHTML = "("+lastmessage.time+")"
	messagebox.innerHTML = lastmessage.content;
	downloaderbox.innerHTML = dochtml;
	
	downloaderbox.onclick = function() {window.open(downloaderbox.getElementsByTagName("A")[0].href,'_blank');}
}

init();