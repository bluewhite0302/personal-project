let summaryList;
let detailList;

//#region 영화 리스트 생성
window.onload = function () {
  summaryList = document.querySelector("#summaryList");
  detailList = document.querySelector("#detailList");
  detailList.style.display = "none";

  document.querySelector("#summaryBtn").addEventListener("click", showSummaryList);
  document.querySelector("#detailBtn").addEventListener("click", showDetailList);

  createListFromJson();
};

function createListFromJson() {
  // https://developer.mozilla.org/en-US/docs/Web/API/Response/json
  const requestURL = "json/dummy.json";
  const request = new Request(requestURL);
  fetch(request)
    .then((response) => response.json())
    .then((data) => createList(data))
    .catch(console.error);
}

function createList(jsonData) {
  for (const movie of jsonData.movies) {
    setSummaryList(movie);
    setDetailList(movie);
  }
}

// 간단 리스트 구성
function setSummaryList(movie){
    const summaryItem = document.createElement("li");
    let summaryItemDescDiv = createChildDivElement(summaryItem, 'summaryItemDescDiv');
    let img = createChildImageElement(summaryItemDescDiv, `images/${movie.posterImageFileName}`, movie.posterImageFileName);
    let descDiv = createChildDivElement(summaryItemDescDiv, 'summaryDesc');
    let descText = createChildTextElement(descDiv, "p", movie.description);

    // 이미지가 로딩될 때 css에 지정해둔 width대로 height가 자동 조절되므로, descDiv가 그 시점에서의 값으로 크기가 지정되도록 함
    // https://stackoverflow.com/questions/10478649/get-actual-image-size-after-resizing-it
    img.onload = function() {
      descDiv.style.width = img.width+"px";
      descDiv.style.height = img.height+"px";
    }

    createChildTextElement(summaryItem, "p", movie.title);

    summaryList.appendChild(summaryItem);
}

// 자세한 리스트 구성
function setDetailList(movie){
    // 좌측 상세사항
    const detailItem = document.createElement("li");
    detailItem.setAttribute("class", "detailItem");
    let descDiv = document.createElement("div");
    createChildTextElement(descDiv, "h3", movie.title);
    createChildTextElement(descDiv, "p", `감독: ${movie.creator}`);
    createChildTextElement(descDiv, "p", `출연진: ${movie.castMembers.join(", ")}`);
    createChildTextElement(descDiv, "p", `등급: ${movie.permissibleAge}세이상관람가`);  // TODO - 전체관람가에 대한 예외처리가 안 되어있음
    createChildTextElement(descDiv, "p", `상영시간: ${movie.runningTimeMinutes}분`);
    detailItem.appendChild(descDiv);

    // 우측 이미지
    let imgDiv = document.createElement("div");
    createChildImageElement(imgDiv, `images/${movie.posterImageFileName}`, movie.posterImageFileName);
    detailItem.appendChild(imgDiv);

    detailList.appendChild(detailItem);
}

// TODO - 아래 3가지 createChild 함수들은 별도의 js 파일로 분리해야함
// https://jjeongil.tistory.com/948
function createChildDivElement(parent, className = null){
  let div = document.createElement('div');
  if(className !== null)
    div.setAttribute('class', className);
  parent.appendChild(div);

  return div;
}

function createChildTextElement(parent, tag, content) {
  let text = document.createElement(tag);
  parent.appendChild(text).textContent = content;

  return text;
}

function createChildImageElement(parent, src, alt) {
  let img = document.createElement("img");
  img.setAttribute("src", src);
  img.setAttribute("alt", alt);
  parent.appendChild(img);

  return img;
}
//#endregion

/////////////////////////////////////////////////////////////////////////////

function showSummaryList() {
  summaryList.style.display = "flex";
  detailList.style.display = "none";
}

function showDetailList() {
  summaryList.style.display = "none";
  detailList.style.display = "flex";
}