let indexCnt = 65;
class Notepad {
    #tab = '';//close에서 사용. active 되지 않아도 지울 수 있기 때문에  li를 넘겨줌
    #contDiv = null;
    constructor(name = "newFile", content) {
        this.name = name;
        this.content = content;//불러오기 할 때 파일 불러와서 넣어줄 부분
        this.isSaved = 'false';
        this.id = String.fromCodePoint(indexCnt);
        this.#addContentArea();
        this.#makeActiveTab();
        this.#creatCloseBtn();
        indexCnt++;
    }
    #addContentArea() {
        //새로 생성된 tab이 활성화 됨
		const tabListAll = document.querySelectorAll('.tab_menu .tab_list li');
		for ( let list of tabListAll ) {
			list.classList.remove('is_on');
		}
        
        let name = this.name;
		const tabList = document.querySelector(".tab_list");
		const contentArea = document.querySelector(".cont_area");

		let li = document.createElement('li');
		li.setAttribute("class", "is_on");
		
		let tab = document.createElement("a");
        tab.setAttribute("href", "#"+this.id);
		tab.setAttribute("class", "tab_nameBtn");
		tab.textContent = name;

		let img = document.createElement("img");
		img.setAttribute("class", "closeBtnImg");
		img.setAttribute("src", "close-outline.svg");
        img.setAttribute("id", "img"+name);
	
		let cont = document.createElement("div");
		cont.setAttribute("id", this.id);
		cont.setAttribute("class", "cont");
		cont.setAttribute("contenteditable", true);
        this.#contDiv = cont;
        if ( this.content ) {
            cont.textContent = this.content;
        }

		li.appendChild(tab);
		li.appendChild(img);
		tabList.appendChild(li);
		contentArea.appendChild(cont);
        this.#tab = li;
        
        //Tab 이름 더블클릭 시 이름 변경
        //이벤트 위임!!!
        let tabParent = tab.parentNode;
        tabParent.addEventListener('dblclick', function(e) {
            e.preventDefault();
            let input = document.createElement("Input");//Input 요소를 만들어서
            input.setAttribute("class", "tabInput");
            this.replaceChild(input, this.firstElementChild);//기존 요소랑 교체
            
            let newInput = document.getElementsByClassName("tabInput")[0];
            newInput.addEventListener('keydown', function(e) {//Input으로 받은 값을 새로운 이름으로 대체
                if ( e.keyCode == 13 ) {//엔터 누르면
                    e.preventDefault();
                    const newName = document.getElementsByClassName('tabInput')[0].value;
                    tab.textContent = newName;
                    li.replaceChild(tab, this);
                }
            });
        });
    }
    close (closeBtn) {
        const tabListAll = document.querySelectorAll('.tab_menu .tab_list li');
        const tabName = closeBtn.previousSibling.textContent;
        if ( localStorage.getItem(tabName) === null ) {
            if ( !confirm('저장되지 않은 파일입니다. 그래도 닫으시겠습니까?') ) {//취소
                return;
            }
        }

        this.#contDiv.remove();//연결된 cont area 삭제
        this.#tab.remove();//탭 삭제

        if ( tabListAll.length > 1 ) {
            document.querySelector('.tab_menu .tab_list').lastChild.classList.add('is_on');
            document.querySelector('.cont_area').lastChild.style.display = 'block';
        }
    }
    #creatCloseBtn () {
        this.closeBtn = this.#tab.lastChild;
        
        this.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.close(this.closeBtn);
            e.stopPropagation();
        });
    }
    #makeActiveTab(activeCont = '') {//탭버튼 클릭시 연결해 주는 옵션 
		const tabLists = document.querySelectorAll('.tab_menu .tab_list li');
		const contents = document.querySelectorAll('.cont');
		for ( let i=0; i < tabLists.length; i++ ) {
			tabLists[i].addEventListener('click', function(e) {
                e.preventDefault();//a태그 클릭시 herf로 인한 화면 이동 막아준데
				for ( let j=0; j < tabLists.length; j++ ) {
					tabLists[j].classList.remove('is_on');
					contents[j].style.display = "none";
				}
                this.classList.add('is_on');
				//활성화된 컨텐츠 전환
                activeCont = "#"+contents[i].id;
                if ( document.querySelector(activeCont) !== null ) {
                    document.querySelector(activeCont).style.display = "block";
                }
			});
		}
	}
    //save on DataFileSystem
    save (key) {
        if ( !key ) {
            key = document.querySelector('.is_on a').getAttribute('href').substr(1);
        }
        const value = document.getElementById(key).innerText;
        this.isSaved = true;

        const req = { id : this.name, value : value }
        fetch('http://localhost:8000/notes', {
            method: "POST",//RESTful
            headers: {//내가 보낼 데이터 타입
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(req)//obj->문자열
        }).then ((res) => console.log(res.json()));
    }

    //remove From DataFileSystem
    remove () {
        removeDataFromFileSys(this.name);
    }
}

function loadDataFromApiServer(name) {
    fetch(`http://localhost:8000/notes/${name}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(resData => {
            console.log('Data from API server:', resData);
            while( name !== null && !resData ) {
                alert('해당 이름으로 저장된 파일이 없습니다.');
                name = prompt('가져올 파일의 이름을 넣어주세요!');
            }
            if ( name ) {
                let notepad = new Notepad(name, resData);
                notepadContainer[notepad.id] = notepad;
            }
        })
        .catch(error => {console.error('Fetch error:', error);
    });	
}

function removeDataFromFileSys(name) {
    fetch(`http://localhost:8000/notes/${name}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if ( !res.ok ) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => { console.log(data.message);})
        .catch(err => {console.error('Fetch error:', err);});
}
