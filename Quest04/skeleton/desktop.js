class Desktop {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	//바탕화면의 생성자를 통해 처음에 생겨날 아이콘과 폴더의 개수를 받을 수 있습니다
	//여러 개의 바탕화면을 각각 다른 DOM 엘리먼트에서 동시에 운영할 수 있습니다.
	//Drag & Drop API를 사용하지 말고, 실제 마우스 이벤트(mouseover, mousedown, mouseout 등)를 사용하여 구현해 보세요!
	constructor(folderNum, iconNum) {
		this.folderNum = folderNum;
		this.iconNum = iconNum;
	}
	makeIcons (name) {
		let iconNum = this.iconNum;
		for ( let i = 1; i <= iconNum; i++ ) {
			let icon = new Icon(name);
			let parent = document.getElementsByTagName("div")[0];
			parent.appendChild(icon.makeIcon());
		}
	}
	makeFolders (name) {
		let folderNum = this.folderNum;
		for ( let i = 1; i <= folderNum; i++ ) {
			let folder = new Folder(name);
			let parent = document.getElementsByTagName("div")[0];
			parent.appendChild(folder.img);
		}
	}
};
		
class Icon {
	constructor(name) {
		this.name = name;
	}
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	//드레그를 통해 움직일 수 있어야 한다
	makeIcon() {
		let newIcon = document.createElement("img");
		//let wrapper = document.createElement("div");
		//wrapper.classList.add("div");
		newIcon.src = "icons8-star-100.png";
		newIcon.style.position = 'absolute';//넣어줘야 left.top을 사용가능
		//wrapper.appendChild(newIcon);

		newIcon.onmousedown = function(event) {
			//이벤트가 발생했을 때 마우스에서 공의 left/top 까지 거리 기억해서 드래그 동안 거리유지
			let shiftX = event.clientX - newIcon.getBoundingClientRect().left;
			let shiftY = event.clientY - newIcon.getBoundingClientRect().top;

			// 초기 이동을 고려한 좌표 (pageX, pageY)에서
			function moveAt(pageX, pageY) {
				newIcon.style.left = pageX - shiftX + 'px';
				newIcon.style.top = pageY - shiftY + 'px';
			}

			function onMouseMove(event) {
				moveAt(event.pageX, event.pageY);
			}
			// mousemove움직임
			document.addEventListener('mousemove', onMouseMove);

			// 드롭하고, 불필요한 핸들러를 제거
			newIcon.onmouseup = function() {
				document.removeEventListener('mousemove', onMouseMove);
				newIcon.onmouseup = null;
			};
			
			newIcon.ondragstart = function() {
				return false;
			};
		};
		return newIcon;
	};
};

class Folder {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	//폴더 아이콘은 더블클릭하면 해당 폴더가 창으로 열리며, 열린 폴더의 창 역시 드래그를 통해 움직일 수 있어야 합니다.
	#isOpen = false;
	constructor(name) {
		this.name = name;
		this.img = this.makeFolder();
	}

	makeFolder() {
		let newFolder= document.createElement("img");
		//let wrapper = document.createElement("div");
		newFolder.src = "icons8-folder-48.png";
		newFolder.style.position = 'absolute';//넣어줘야 left.top을 사용가능
		//wrapper.appendChild(newFolder);
		
		//드레그 이벤트
		newFolder.onmousedown = function(event) {
			let shiftX = event.clientX - newFolder.getBoundingClientRect().left;
			let shiftY = event.clientY - newFolder.getBoundingClientRect().top;
			
			function moveAt(pageX, pageY) {
				newFolder.style.left = pageX - shiftX + 'px';
				newFolder.style.top = pageY - shiftY + 'px';
			}

			function onMouseMove(event) {
				moveAt(event.pageX, event.pageY);
			}

			document.addEventListener('mousemove', onMouseMove);
			newFolder.onmouseup = function() {
				document.removeEventListener('mousemove', onMouseMove);
				newFolder.onmouseup = null;
			};
			
			newFolder.ondragstart = function() {
				return false;
			};
		};

		//더블클릭 이벤트
		//let clicking = false;
		newFolder.addEventListener("dblclick", () => {
			if ( this.#isOpen ) { return; } // 폴더 하나를 여러번 더블클릭해도 한번만 열리게 함
			this.#isOpen = true;
			const box= document.createElement("div");
			const button = document.createElement("Input");
			button.type = 'button';
			button.value = '닫기';
			box.classList.add("box");
			box.appendChild(button);

			button.addEventListener('click', () => { //버튼 누르면 박스 사라짐
				box.remove();
			});
			let parent = document.getElementsByTagName("div")[0];
			parent.appendChild(box);

			box.onmousedown = function(event) {
				let shiftX = event.clientX - box.getBoundingClientRect().left;
				let shiftY = event.clientY - box.getBoundingClientRect().top;
				
				function moveAt(pageX, pageY) {
					box.style.left = pageX - shiftX + 'px';
					box.style.top = pageY - shiftY + 'px';
				}

				function onMouseMove(event) {
					moveAt(event.pageX, event.pageY);
				}

				document.addEventListener('mousemove', onMouseMove);

				box.onmouseup = function() {
					document.removeEventListener('mousemove', onMouseMove);
					box.onmouseup = null;
				};
				box.ondragstart = function() {
					return false;
				};
			};
		});
		return newFolder;
	};
};

class Window {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
};
