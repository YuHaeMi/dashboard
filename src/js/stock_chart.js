(()=>{

//-- queue --//
class Queue {
	constructor( qId ){
		this.qId = qId;
		this.qArray = [];
	}
	pushItem( inItem ){
		//console.log("queue 들어옴?",this.qArray);
		this.qArray.push( inItem );

	}
	shiftItem(){
		//console.log(this.qArray);
		return this.qArray.shift();
	}
	countItems(){
		return this.qArray.length;
	}
}
//-- queue end --//

const stockQueue = new Queue("주식 종목 10");

//-- 주식 차트 시작 --//
class StockChart {
  constructor( chartName ){
    this.chartName = chartName;
    this.chartWidth = 0;
		this.stockArray = [];
    this.clickTarget = 0;
  }

  graphTime(){
    let getTime = new Date();
    let graphHours = getTime.getHours();
    let graphMinutes = getTime.getMinutes();
    let graphSeconds = getTime.getSeconds();
    console.log(graphHours,'시', graphMinutes,'분', graphSeconds,'초');
    return document.getElementById("dateZone").innerHTML += `<span class="setDate">${graphHours < 10? `0${graphHours}`: graphHours}:${graphMinutes < 10? `0${graphMinutes}` : graphMinutes}:${graphSeconds < 10? `0${graphSeconds}`: graphSeconds}</span>`;
  }

  showZone() {
    //-- JSON 받아오기 --//
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = stockData =>{
      let result = stockData.target;
      if( result.readyState == 4 && result.status == 200 ){
        let stockInfo = JSON.parse(result.responseText);
				stockQueue.pushItem(stockInfo);
				this.stockArray.push(stockQueue.shiftItem());
				//console.log(this.stockQueue);
				let {stockList} = this.stockArray.shift();
				document.getElementById("allPartStockWrap").innerHTML = '';
        let val_sum_set = 0;
				stockList.forEach((v,i,a)=>{
          let val_sum = v.moneyCount.reduce((preN, curN)=> preN + curN);
          console.log(val_sum);
          if(stockList[i].countData == 0){
            val_sum = 0;
          }else{
            val_sum_set = val_sum;
          }
					//--종목 리스트 구간 시작--//
					document.getElementById("allPartStockWrap").innerHTML += `
					<p class="allPartStock">
						<span class="stockEvent">${v.stockProduct}</span>
						<span class="stockUpDown">${v.upDownPrice}%</span>
						<span class="stockVolume">${val_sum_set.toLocaleString()}</span>
						<span class="stockPrice">${v.randomPrice.toLocaleString()}</span>
					</p>`;
          if(Math.sign(v.upDownPrice) == -1){
            document.querySelectorAll(".stockUpDown")[i].style.color = 'blue';
          }else {
            document.querySelectorAll(".stockUpDown")[i].style.color = 'red';
          }
					const listItem = document.querySelectorAll(".allPartStock");
					listItem.forEach((v2,i2,a2)=>{
            //pocusItem[i2].classList.remove("chartBorder");
            //--종목 클릭 시작--//
						v2.addEventListener("click", ()=>{
              this.clickTarget=i2;
              //pocusItem[i2].classList.add("chartBorder");
							//console.log(stockList[i2]);
              document.getElementById("dateZone").innerHTML = '';
              this.graphTime();
							//--정보 화면 시작--//
              document.querySelector("#stockIndex").innerHTML = `<p>${stockList[i2].stockProduct}</p>`;
							//--거래 정보화면 시작--//
							document.getElementById("uIWrap").innerHTML = `
							<p>
								<span>전일 종가</span>
								<span>${stockList[i2].stockPrePrice.toLocaleString()}</span>
							</p>
							<p id="sumDeal">
								<span>거래대금</span>
								<span>${stockList[i2].countData.toLocaleString()}</span>
							</p>
							<p>
								<span>상한가</span>
								<span>${stockList[i2].stockUpperPrice.toLocaleString()}</span>
							</p>
							<p>
								<span>하한가</span>
								<span>${stockList[i2].stockLowPrice.toLocaleString()}</span>
							</p>
							<p>
								<span>시가</span>
								<span>${stockList[i2].stockPrePrice.toLocaleString()}</span>
							</p>
							<p>
								<span>고가</span>
								<span>${stockList[i2].stockPresentPrice[0].toLocaleString()}</span>
							</p>
							<p>
								<span>저가</span>
								<span>${stockList[i2].stockPresentPrice[stockList[i2].stockPresentPrice.length-1].toLocaleString()}</span>
							</p>
							`;
							//console.log(stockList[i2].stockPresentPrice.length);
							//--거래 정보화면 끝--//
							document.getElementById("dealZone").innerHTML = '';
							document.getElementById("dealZone").innerHTML += `
							<p>
              <span>${stockList[i2].randomPrice.toLocaleString()}</span>
              <sapn>${stockList[i2].countValue.toLocaleString()}</span>
							</p>
							`;
							//--거래대금 수량화면 시작--//
							document.getElementById("vPWrap").innerHTML ='';
							let valPerent = 0;
              for(let k=0; k<stockList[i2].stockPresentPrice.length; k++){

                console.log(stockList[i2].moneyCount[k]);
                document.getElementById("vPWrap").innerHTML += `
								<p class="volPriceZone">
                <span class="titleEvent">${stockList[i2].moneyCount[k].toLocaleString()}
                <span class="tEventGraph" style=" width:${stockList[i2].moneyCount[k]}%;"></span>
                </span>
                <span class="tPrice">${stockList[i2].stockPresentPrice[k].toLocaleString()}</span>
                </p>`;
                console.log(stockList[i2].stockPresentPrice[k]);
                //document.querySelectorAll(".allPartStock")[k].classList.remove("aPSBack");
              }
              //document.querySelectorAll(".allPartStock")[i2].classList.add("aPSBack");
              let pocusItem = document.querySelectorAll(".volPriceZone");
              console.log(pocusItem[i2]);
              pocusItem[stockList[i2].stockPresentPrice.indexOf(stockList[i2].randomPrice)].classList.add("chartBorder");
              //--거래대금 수량화면 끝--//

              //--그래프 시작--//
              console.log("안쪽 그래프",stockList[i2].matchValue);
              document.getElementById("leftChart").innerHTML = ``;
              document.getElementById("leftChart").innerHTML += `
                <div class="graphItem">
                  <div class="upGraph" style="height:${stockList[i2].heightValue}%;"></div>
                </div>
              `;

              if(stockList[i2].graphMove < 0){
                document.querySelector(".leftChart>div:last-child>div").style.bottom =`${stockList[i2].prevMatchValue}%`;
                document.querySelector(".leftChart>div:last-child>div").style.backgroundColor =`red`;
              }else if(stockList[i2].graphMove > 0){
                document.querySelector(".leftChart>div:last-child>div").style.top =`${100 - stockList[i2].prevMatchValue}%`;
                document.querySelector(".leftChart>div:last-child>div").style.backgroundColor =`blue`;

              }else if(stockList[i2].graphMove == 0){
                document.querySelector(".leftChart>div:last-child>div").style.height =`1px`;
                document.querySelector(".leftChart>div:last-child>div").style.backgroundColor=`purple`;
                document.querySelector(".leftChart>div:last-child>div").style.bottom =`${stockList[i2].prevMatchValue}%`;
              }
              document.getElementById("leftChart").style.width = `${20 * document.querySelectorAll(".graphItem").length}px`
              document.querySelector(".leftChartWrap").scrollTo({ left: document.querySelector(".leftChartWrap").scrollWidth, behavior: "auto" });  
              document.getElementById("dateZone").style.width = `${80 *document.querySelectorAll(".setDate").length+1}px`
              document.querySelector(".leftDate").scrollTo({ left: document.querySelector(".leftDate").scrollWidth, behavior: "auto" });  
                //--그래프 끝--//

              //--그래프 가격 5 시작--//
              document.getElementById("rightIndicator").innerHTML =``;
              for(let a=0; a<5; a++){
                document.getElementById("rightIndicator").innerHTML +=`<p>${stockList[i2].stockGraphValue[a]}</p>`;
              }
              //--그래프 가격 5 끝--//

              //--정보 화면 끝--//
              });
            });
            //--종목 클릭 끝--//
						//--정보 화면 시작--//
            document.getElementById("uIWrap").innerHTML = `
            <p>
              <span>전일 종가</span>
              <span>${stockList[this.clickTarget].stockPrePrice.toLocaleString()}</span>
            </p>
            <p id="sumDeal">
              <span>거래대금</span>
              <span>${stockList[this.clickTarget].countData.toLocaleString()}</span>
            </p>
            <p>
            <span>상한가</span>
              <span>${stockList[this.clickTarget].stockUpperPrice.toLocaleString()}</span>
            </p>
            <p>
              <span>하한가</span>
              <span>${stockList[this.clickTarget].stockLowPrice.toLocaleString()}</span>
            </p>
            <p>
              <span>시가</span>
              <span>${stockList[this.clickTarget].stockPrePrice.toLocaleString()}</span>
            </p>
            <p>
              <span>고가</span>
              <span>${stockList[this.clickTarget].stockPresentPrice[0].toLocaleString()}</span>
            </p>
            <p>
              <span>저가</span>
              <span>${stockList[this.clickTarget].stockPresentPrice[stockList[this.clickTarget].stockPresentPrice.length-1].toLocaleString()}</span>
            </p>
            `;

            //console.log(stockList[this.clickTarget].stockPresentPrice.length);
            document.getElementById("vPWrap").innerHTML ='';
            for(let k=0; k<stockList[this.clickTarget].stockPresentPrice.length; k++){
              document.getElementById("vPWrap").innerHTML += `
              <p class="volPriceZone">
                <span class="titleEvent">
                  <span class="tEventGraph" style=" width:${stockList[this.clickTarget].moneyCount[k]}%; "></span>
                    ${stockList[this.clickTarget].moneyCount[k].toLocaleString()}
                  </span>
                <span class="tPrice">${stockList[this.clickTarget].stockPresentPrice[k].toLocaleString()}</span>
              </p>`;
              //console.log("랜덤 뭐?",stockList[this.clickTarget].stockPresentPrice[k]);
              //document.querySelectorAll(".allPartStock")[this.clickTarget].classList.remove("aPSBack");

            }
            //document.querySelectorAll(".allPartStock")[this.clickTarget].classList.add("aPSBack");
            //console.log(val_sum);
            const pocusItem = document.querySelectorAll(".volPriceZone");
            pocusItem[stockList[this.clickTarget].stockPresentPrice.indexOf(stockList[this.clickTarget].randomPrice)].classList.add("chartBorder");
            //console.log("밖 값", pocusItem[stockList[this.clickTarget].stockPresentPrice.indexOf(stockList[this.clickTarget].randomPrice)]);
            //--정보 화면 끝--//
            document.querySelector("#stockIndex").innerHTML = `<p>${stockList[this.clickTarget].stockProduct}</p>`;



					//--종목 리스트 구간 끝--//
					//console.log(v);
				});
        //--그래프 시작--//
        // console.log("밖 그래프",stockList[this.clickTarget].matchValue);
        document.getElementById("leftChart").innerHTML += `
          <div class="graphItem">
            <div class="upGraph" style="height:${stockList[this.clickTarget].heightValue}%;"></div>
          </div>
        `;
      //  console.log('move  :  ' ,stockList[this.clickTarget].graphMove);
      //  console.log('prev  :  ' ,stockList[this.clickTarget].prevMatchValue);
      //  console.log('next  :  ' ,stockList[this.clickTarget].matchValue);
        if(stockList[this.clickTarget].graphMove < 0){
          document.querySelector(".leftChart>div:last-child>div").style.bottom =`${stockList[this.clickTarget].prevMatchValue}%`;
          document.querySelector(".leftChart>div:last-child>div").style.backgroundColor =`red`;
        }else if(stockList[this.clickTarget].graphMove > 0){
          document.querySelector(".leftChart>div:last-child>div").style.top =`${100 - stockList[this.clickTarget].prevMatchValue}%`;
          document.querySelector(".leftChart>div:last-child>div").style.backgroundColor =`blue`;

        }else if(stockList[this.clickTarget].graphMove == 0){
          document.querySelector(".leftChart>div:last-child>div").style.height =`1px`;
          document.querySelector(".leftChart>div:last-child>div").style.backgroundColor=`purple`;
          document.querySelector(".leftChart>div:last-child>div").style.bottom =`${stockList[this.clickTarget].prevMatchValue}%`;
				}
        document.getElementById("leftChart").style.width = `${20 * document.querySelectorAll(".graphItem").length}px`
				document.querySelector(".leftChartWrap").scrollTo({ left: document.querySelector(".leftChartWrap").scrollWidth, behavior: "auto" });  
				document.querySelector(".dateZone").scrollTo({ left: document.querySelector(".dateZone").scrollWidth, behavior: "auto" });  
        //--그래프 끝--//

        //--그래프 가격 5 시작--//
        // console.log('그래프의 this.cliclTarget', stockList[this.clickTarget].stockGraphValue);
        document.getElementById("rightIndicator").innerHTML =``;
        for(let i=0; i<5; i++){
          document.getElementById("rightIndicator").innerHTML +=`<p>${stockList[this.clickTarget].stockGraphValue[i]}</p>`;
        }
          

				//--거래대금 수량화면 시작--//
				//document.getElementById("dealZone").innerHTML = '';
				document.getElementById("dealZone").innerHTML += `
				<p class="dealItem">
        <span>${stockList[this.clickTarget].randomPrice.toLocaleString()}</span>
        <sapn>${stockList[this.clickTarget].countValue.toLocaleString()}</span>
				</p>
				`;
				
				document.getElementById("dealZone").scrollTo({ top: document.getElementById("dealZone").scrollHeight, behavior: "auto" });  
				//--거래대금 수량화면 끝--//
    	}
		}
    xhttp.open("GET", "../../src/js/stock.json", true);
    xhttp.send();
		//-- JSON 받아오기 끝 --//

  }

}
//-- 주식 차트 끝 --//

const chartGraph = new StockChart("test1");
setInterval(()=> {
  chartGraph.showZone();
}, 3000);
clearInterval(chartGraph.graphTime());
setInterval(() => {
  chartGraph.graphTime();
},15000);

	
})();