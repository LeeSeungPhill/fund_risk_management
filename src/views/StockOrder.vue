<template>
    <div>
      <v-container fluid>
        <v-row align="center">
          <v-col cols="1">
            <v-subheader>
              [주문]
            </v-subheader>
          </v-col>
          <v-col cols="1">
            <select v-model="selected">
              <option v-for="(d, i) in options" :key="i" :value="d.value">
                {{ d.text }}
              </option>
            </select>
          </v-col>
          <v-col cols="4" v-if="selected === 'B'">
            <label><input type="radio" value="limit" v-model="radioSel">주문가</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="market" v-model="radioSel">시장가</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="bflow" v-model="radioSel">시장흐름정액</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="loss" v-model="radioSel">종목손실금액</label>
          </v-col>
          <v-col cols="4" v-if="selected === 'S'">
            <label><input type="radio" value="limit" v-model="radioSel">주문가</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="market" v-model="radioSel">시장가</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="sflow" v-model="radioSel">시장기준수량</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="half" v-model="radioSel">보유물량절반</label>
          </v-col>
        </v-row>
        <v-row v-if="selected === 'B'">
          <v-col cols="1" md="5">
            <v-text-field v-model="data.code" :counter="6" label="종목코드" required></v-text-field>
          </v-col>
          <v-col cols="1" md="5">
            <v-text-field v-model="data.name" label="종목명" required></v-text-field>
          </v-col>    
          <v-col v-show="radioSel != 'market'" cols="1" md="5">
            <v-text-field v-model="data.buy_price" label="주문단가" ></v-text-field>
          </v-col>    
          <v-col v-show="radioSel === 'limit' || radioSel === 'market'" cols="1" md="5">
            <v-text-field v-model="data.buy_amount" label="주문수량" ></v-text-field>
          </v-col>
          <v-col cols="1" md="5">
            <v-text-field v-model="data.loss_price" label="손절가" ></v-text-field>
          </v-col>
          <v-col cols="1" md="5">
            <v-text-field v-model="data.target_price" label="목표가" ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="selected === 'S'">
          <v-col cols="1" md="5">
            <v-text-field v-model="data.code" :counter="6" label="종목코드" required></v-text-field>
          </v-col>
          <v-col cols="1" md="5">
            <v-text-field v-model="data.name" label="종목명" required></v-text-field>
          </v-col>    
          <v-col v-show="radioSel != 'market'" cols="1" md="5">
            <v-text-field v-model="data.sell_price" label="매도단가" ></v-text-field>
          </v-col>    
          <v-col v-show="radioSel === 'limit' || radioSel === 'market'" cols="1" md="5">
            <v-text-field v-model="data.sell_amount" label="매도수량" ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="clearForm" style="background: gray">초기화</v-btn>
            <v-btn @click="sendForm" style="background: mediumaquamarine">저장</v-btn>
            <v-btn @click="sendOrderList" style="background: red">전송</v-btn>
            <v-btn @click="reload()" style="background: skyblue">주문갱신</v-btn>
            <v-btn @click="openPopup1()" style="background: pink">종목시세</v-btn>            
            <v-btn @click="openPopup2()" style="background: orange">수급잠정</v-btn>
            <v-btn @click="openPopup3()" style="background: sienna">관심종목</v-btn>
            <v-btn @click="openPopup4()" style="background: rgb(125, 160, 45)">종목검색</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="popup-view" :class="{active: popupView1}">
      <pop-up1 @close-popup="openPopup1()"></pop-up1>
    </div>
    <div class="popup-view" :class="{active: popupView2}">
      <pop-up2 @close-popup="openPopup2()"></pop-up2>
    </div>
    <div class="popup-view" :class="{active: popupView3}">
      <pop-up3 @close-popup="openPopup3()"></pop-up3>
    </div>
    <div class="popup-view" :class="{active: popupView4}">
      <pop-up4 @close-popup="openPopup4()"></pop-up4>
    </div>    
    <div>
      <v-container fluid>
        <v-row align="center">
          <v-col cols="20">
            <v-subheader>
              [일별 주문 내역]
            </v-subheader>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">종목코드</v-col>
          <v-col cols="1">종목명</v-col>
          <v-col cols="1">매수가</v-col>
          <v-col cols="1">매수량</v-col>
          <v-col cols="1">매도가</v-col>
          <v-col cols="1">매도량</v-col>
          <v-col cols="1">손절가</v-col>
          <v-col cols="1">목표가</v-col>
          <v-col cols="1">매매유형</v-col>
          <v-col cols="1">주문상태</v-col>
          <v-col cols="1">체결량</v-col>
          <v-col cols="1">잔여량</v-col>
          <v-col cols="1"></v-col>
          <v-col cols="1"></v-col>
          <v-col cols="2"></v-col>
        </v-row>
        <v-row v-for="(item, index) in StockOrderList" v-bind:key="index">
          <v-col cols="1">{{item.code}}</v-col>
          <v-col cols="1">{{item.name}}</v-col>
          <v-col cols="1">{{item.buy_price}}</v-col>
          <v-col cols="1">{{item.buy_amount}}</v-col>
          <v-col cols="1">{{item.sell_price}}</v-col>
          <v-col cols="1">{{item.sell_amount}}</v-col>
          <v-col cols="1">{{item.loss_price}}</v-col>
          <v-col cols="1">{{item.target_price}}</v-col>
          <v-col cols="1">{{item.trading_type}}</v-col>
          <v-col cols="1">{{item.order_stat}}</v-col>
          <v-col cols="1">{{item.total_complete_qty }}</v-col>
          <v-col cols="1">{{item.remain_qty }}</v-col>
          <v-col cols="1" v-if="item.proc_yn === 'N'">
            <v-btn @click="deleteOrder(item.id)" color="#F44336">삭제</v-btn> 
          </v-col>
          <v-col cols="1" v-if="item.remain_qty > 0 && item.order_stat != '04'">
            <v-btn @click="item.is_hidden = !item.is_hidden;onlyStockOrder(item, StockOrderList)" color="gray">변경</v-btn>
            <v-btn v-if="item.trading_type === 'B'" @click="cancelOrder(item.id, item.order_no, item.buy_price, item.remain_qty)" color="gray">취소</v-btn> 
            <v-btn v-if="item.trading_type === 'S'" @click="cancelOrder(item.id, item.order_no, item.sell_price, item.remain_qty)" color="gray">취소</v-btn> 
          </v-col>
          <v-col cols="2">
            <v-form v-show="item.is_hidden">
              <v-container>
                <v-row v-if="item.trading_type === 'B'">
                  <v-col>
                    <v-text-field v-model="data.buy_price" label="주문단가" ></v-text-field>
                  </v-col>    
                  <v-col>
                    <v-btn @click="item.is_hidden = !item.is_hidden;updateBuyOrder(data, item.id, item.order_no, item.remain_qty);" v-show="item.is_hidden" color="#4CAF50">전송</v-btn>
                  </v-col>   
                </v-row>
                <v-row v-if="item.trading_type === 'S'">
                  <v-col>
                    <v-text-field v-model="data.sell_price" label="매도단가" ></v-text-field>
                  </v-col>    
                  <v-col>
                    <v-btn @click="item.is_hidden = !item.is_hidden;updateSellOrder(data, item.id, item.order_no, item.remain_qty);" v-show="item.is_hidden" color="#4CAF50">전송</v-btn>
                  </v-col>   
                </v-row>
              </v-container>
            </v-form>
          </v-col>
        </v-row>  
      </v-container>
    </div>
    <div>
      <v-container fluid>
        <v-row align="center">
          <v-col cols="11">
            <v-subheader>
              [일별 주문 체결]
            </v-subheader>
          </v-col>
        </v-row>
        <v-row>
          <v-col>주문번호</v-col>
          <v-col>원주문번호</v-col>
          <v-col>주문구분</v-col>
          <v-col>주문일자</v-col>
          <v-col>주문시각</v-col>
          <v-col>종목명</v-col>
          <v-col>주문가</v-col>
          <v-col>주문수량</v-col>
          <v-col>총체결수량</v-col>
          <v-col>잔여수량</v-col>
          <v-col>총체결금액</v-col>
        </v-row>
        <v-row v-for="(item, index) in OrderCompleteList" v-bind:key="index">
          <v-col>{{item.order_no}}</v-col>
          <v-col>{{item.org_order_no}}</v-col>
          <v-col>{{item.order_type}}</v-col>
          <v-col>{{item.order_dt}}</v-col>
          <v-col>{{item.order_tmd}}</v-col>
          <v-col>{{item.name}}</v-col>
          <v-col>{{item.order_price}}</v-col>
          <v-col>{{item.order_amount}}</v-col>
          <v-col>{{item.total_complete_qty}}</v-col>
          <v-col>{{item.remain_qty}}</v-col>
          <v-col>{{item.total_complete_amt}}</v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="sendLevel(1)" style="background: lightyellow">[하락지속 기술적반등]</v-btn>
            <v-btn @click="sendLevel(2)" style="background: lightsteelblue">[단기추세 기술적반등]</v-btn>
            <v-btn @click="sendLevel(3)" style="background: greenyellow">[패턴 기술적반등]</v-btn>
            <v-btn @click="sendLevel(4)" style="background: greenyellow">[추세전환 눌림반등]</v-btn>
            <v-btn @click="sendLevel(5)" style="background: greenyellow">[상승지속 기술적반등]</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>  
</template>
<script>
import axios from "axios";
import PopUp1 from '../components/StockInfo.vue'
import PopUp2 from '../components/SubjectSubTotal.vue'
import PopUp3 from '../components/InterestItem.vue'
import PopUp4 from '../components/StockSearch.vue'

let url = "http://phills2.gonetis.com:8000/kis/stockOrder/"; //장고 서버 주소

  export default {

    data: () => {
        return {
            popupView1: false,
            popupView2: false,
            popupView3: false,
            popupView4: false,
            stock_asset_num: null,
            stock_asset_risk_num: null,
            StockOrderList: [],
            OrderCompleteList: [],
            radioSel: 'limit',
            selected: 'B',
            options: [
              { text: '매수', value: 'B' },
              { text: '매도', value: 'S' }          
            ],
            data: {
                code: "",
                name: "",
                buy_price: "",
                buy_amount: "",
                sell_price: "",
                sell_amount: "",
                loss_price: "",
                target_price: "",
            },
            upd: {
              buy_price: "",
              sell_price: "",
              id: "",
              trading_type: "",
              order_no: "",
              remain_qty: ""
            },
            date: new Date(),
        };
    },
    name: 'stockOrder',
    components: {
      PopUp1,
      PopUp2,
      PopUp3,
      PopUp4,
    },
    methods: {
      sendForm: function() { 
        if (this.radioSel == 'market'){
          this.data.buy_price = '-1'
          this.data.sell_price = '-1'
        }else if (this.radioSel == 'bflow'){
          this.data.buy_amount = '0'
          this.stock_asset_num = '0'
        }else if (this.radioSel == 'loss'){
          this.data.buy_amount = '0'
        }else if (this.radioSel == 'sflow'){
          this.data.sell_amount = '0'
        }else if (this.radioSel == 'half'){
          this.data.sell_amount = '0'
          this.stock_asset_num = '0'
        }

        if (this.selected == 'B'){
          axios({
            method: "POST",
            url: url,
            data: {
              acct_no: this.$route.params.acct_no,
              code: this.data.code,
              name: this.data.name,
              buy_price: this.data.buy_price,
              buy_amount: this.data.buy_amount,
              sell_price: 0,
              sell_amount: 0,
              loss_price: this.data.loss_price,
              target_price: this.data.target_price,
              trading_type: "B",
              asset_risk_num: this.stock_asset_risk_num,
              asset_num: this.stock_asset_num,
              proc_yn: "N",
              order_no: "0",
              order_stat: "01",
              total_complete_qty: 0,
              remain_qty: 0
            }, 
          }).then((response) => {
            this.StockOrderList = response.data;
            console.log("Success", response);
            this.getOrderCompleteList();
            this.getStockOrderList();            
          }).catch((error) => {
            console.log("Failed to StockOrderList", error.response);
          });
        }else{
          axios({
            method: "POST",
            url: url,
            data: {
              acct_no: this.$route.params.acct_no,
              code: this.data.code,
              name: this.data.name,
              buy_price: 0,
              buy_amount: 0,
              sell_price: this.data.sell_price,
              sell_amount: this.data.sell_amount,
              loss_price: 0,
              target_price: 0,
              trading_type: "S",
              asset_risk_num: this.stock_asset_risk_num,
              asset_num: this.stock_asset_num,
              proc_yn: "N",
              order_no: "0",
              order_stat: "01",
              total_complete_qty: 0,
              remain_qty: 0
            }, 
          }).then((response) => {
            this.StockOrderList = response.data;
            console.log("Success", response);
            this.getOrderCompleteList();
            this.getStockOrderList();
          }).catch((error) => {
            console.log("Failed to StockOrderList", error.response);
          });
        }
      },
      clearForm: function() {
        (this.data.code = ""),(this.data.name = ""),(this.data.buy_price = ""),(this.data.buy_amount = ""),(this.data.sell_price = ""),(this.data.sell_amount = ""),(this.data.loss_price = ""),(this.data.target_price = "");
      },
      deleteOrder: function(id){
        axios({
          method: "DELETE",
          url: url + id + "/", // http://phills2.gonetis.com:8000/kis/stockOrder/1 로 delete 이벤트 전송
        }).then((response) => {
          console.log("Success", response);
          this.getOrderCompleteList();
          this.getStockOrderList();
        }).catch((error) => {
          console.log("Failed to deleteOrder", error.response);
        });
      },
      onlyStockOrder: function(data, StockOrderList){
        // 한개의 리스트만 보이도록
        for (var index in StockOrderList){
          data.id != StockOrderList[index].id ? (StockOrderList[index].is_hidden = false) : "";
        }
        
      },
      updateBuyOrder: function(data, id, order_no, remain_qty){
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/update/",
          params:{
            id: id,
            order_no: order_no,
            buy_price: data.buy_price,
            sell_price: 0,
            order_amount: remain_qty,
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
          
        }).then(response => {
          if(response.data[0].message != "")
              alert(response.data[0].message)
          console.log("Success", response)
          this.getOrderCompleteList();
          this.getStockOrderList();
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to updateBuyOrder", error.response);
        });
      },
      updateSellOrder: function(data, id, order_no, remain_qty){
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/update/",
          params:{
            id: id,
            order_no: order_no,
            buy_price: 0,
            sell_price: data.sell_price,
            order_amount: remain_qty,
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
          
        }).then(response => {
          console.log("Success", response)
          if(response.data[0].message != "")
              alert(response.data[0].message)
          this.getOrderCompleteList();
          this.getStockOrderList();
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to updateBuyOrder", error.response);
        });
      },
      cancelOrder: function(id, order_no, order_price, order_amount){
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/cancel/",
          params:{
            id: id,
            order_no: order_no,
            order_price: order_price,
            order_amount: order_amount,
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
        }).then(response => {
            this.StockOrderList = response.data;
            console.log("Success", response);
            this.getOrderCompleteList();
            this.getStockOrderList();
        }).catch(error => {
            alert("처리 에러")
            console.log("Failed to cancelOrder", error.response);
        });
      },
      openPopup1() {
        this.popupView1 = (this.popupView1) ? false : true
      },
      openPopup2(){
        this.popupView2 = (this.popupView2) ? false : true
      },
      openPopup3(){
        this.popupView3 = (this.popupView3) ? false : true
      },
      openPopup4(){
        this.popupView4 = (this.popupView4) ? false : true
      },
      sendLevel: function(level){
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockMarketMng/list/",
          params:{
            market_level: level,
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
          
        }).then(response => {
          console.log("Success", response)
          alert("처리 완료")
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to send StockMarketLevelMng", error.response);
        });
      },
      sendOrderList() {
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/send/",
          params:{
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
        }).then(response => {
            this.StockOrderList = response.data;
            if(response.data[0].message != "")
              alert(response.data[0].message)
            console.log("Success", response);
            this.getOrderCompleteList();
            this.getStockOrderList();
        }).catch(error => {
            alert("처리 에러")
            console.log("Failed to send OrderList", error.response);
        });
      },
      reload(){
        this.getOrderCompleteList();
        this.getStockOrderList();
      },  
      getStockOrderList() {
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/orderList/",
          params:{
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
        }).then(response => {
            this.StockOrderList = response.data;
            this.stock_asset_num = response.data[0].stock_asset_num
            this.stock_asset_risk_num = response.data[0].stock_asset_risk_num
            console.log("Success", response);
            console.log("stock_asset_num : ", this.stock_asset_num);
            console.log("stock_asset_risk_num : ", this.stock_asset_risk_num);
        }).catch(error => {
            console.log("Failed to get StockOrderList", error.response);
        });
      },
      getOrderCompleteList() {
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrderComplete/",
          params:{
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
        }).then(response => {
            this.OrderCompleteList = response.data;
            console.log("Success", response);
        }).catch(error => {
            alert("처리 에러")
            console.log("Failed to get OrderCompleteList", error.response);
        });
      },
      formatDate(str){
        return str.split('T')[0];
      },    
    },
    created(){
      this.getOrderCompleteList();
      this.getStockOrderList();
    }
  };
  
</script>
<style>
.popup-view{
  opacity: 0;
  display: none;
  visibility: hidden;
}
.active{
  opacity: 1;
  display: block;
  visibility: visible;
}
</style>