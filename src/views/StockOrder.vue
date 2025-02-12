<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-btn @click="reload()" style="background: skyblue">재조회</v-btn>
          <v-btn @click="sendOrderList" style="background: rgb(101, 126, 234)">주문전송</v-btn>
          <v-btn @click="openPopup1()" style="background: rgb(102, 174, 205)">주문등록</v-btn>
          <v-btn @click="openPopup2()" style="background: pink">종목정보</v-btn>            
          <v-btn @click="openPopup3()" style="background: orange">장중동향</v-btn>
          <v-btn @click="openPopup4()" style="background: sienna">관심종목</v-btn>
          <v-btn @click="openPopup5()" style="background: rgb(125, 160, 45)">종목검색</v-btn>
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
  <div class="popup-view" :class="{active: popupView5}">
    <pop-up5 @close-popup="openPopup5()"></pop-up5>
  </div>
  <div>
    <v-container fluid>
      <v-row>
        <v-col align="left">
          <v-subheader>
            [일별 주문 내역]
          </v-subheader>
        </v-col>
        <v-col align="right">
          <v-btn @click="deleteOrder()" style="background: hwb(349 0% 0%)">[주문삭제]</v-btn>
          <v-btn @click="cancelOrder()" style="background: hsl(64, 70%, 61%)">[주문취소]</v-btn>
        </v-col>
      </v-row>
      <ag-grid-vue 
        style="width: 100%; height: 300px;" 
        class="ag-theme-balham" 
        :columnDefs="colDefs1" 
        :rowData="rowData1" 
        :paginationAutoPageSize="true"
        :pagination="true"
        :defaultColDef="defaultColDef1"
        @cellClicked="onCellClicked"
      />
    </v-container>
  </div>
  <div>
    <v-container fluid>
      <v-row>
        <v-col align="left">
          <v-subheader>
            [일별 주문 체결]
          </v-subheader>
        </v-col>
      </v-row>
      <ag-grid-vue 
        style="width: 100%; height: 300px;" 
        class="ag-theme-balham" 
        :columnDefs="colDefs2" 
        :rowData="rowData2" 
        :paginationAutoPageSize="true"
        :pagination="true"
        :defaultColDef="defaultColDef2"
        @cellClicked="onCellClicked"
      />
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
import PopUp1 from '../components/OrderInfo.vue'
import PopUp2 from '../components/StockInfo.vue'
import PopUp3 from '../components/SubjectSubTotal.vue'
import PopUp4 from '../components/InterestItem.vue'
import PopUp5 from '../components/StockSearch.vue'
import { ref, defineComponent } from 'vue';
import {AgGridVue} from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

let url = "http://phills2.asuscomm.com:8000/kis/stockOrder/"; //장고 서버 주소

export default defineComponent({
  name: 'App',
  components:{
    AgGridVue,
    PopUp1,
    PopUp2,
    PopUp3,
    PopUp4,
    PopUp5,
  },
  setup(){

    const defaultColDef1 = ref({
      flex: 1,
      minWidth: 100,
      //editable: true,
    });

    const defaultColDef2 = ref({
      flex: 1,
      minWidth: 100,
      //editable: true,
    });

    const colDefs1 = ref([
      {headerName: 'No', colId: 0, valueGetter: (params) => { return params.node.rowIndex + 1 } },
      {headerName: '선택', field: 'chk', editable: true, cellRenderer:'agCheckboxCellRenderer', cellEditor: 'agCheckboxCellEditor'},
      {headerName: '종목코드', field: 'code'},
      {headerName: '종목명', field: 'name'},
      {headerName: '매수가', field: 'buy_price', valueSetter: params => {
        if(params.data.order_stat === '02' || params.data.order_stat === '05'){                       
          params.data.buy_price = params.newValue;

          axios({
            method: "GET",
            url: "http://phills2.asuscomm.com:8000/stockOrder/update/",
            params:{
              id: params.data.id,
              order_no: params.data.order_no,
              buy_price: params.newValue,
              sell_price: 0,
              order_amount: params.data.remain_qty,
              acct_no: params.data.acct_no,
              app_key: params.data.app_key,
              app_secret: params.data.app_secret,
              access_token: params.data.access_token
            }
            
          }).then(response => {
            console.log("Success", response)
            alert("매수가변경 완료")
            if(response.data[0].message != "")
              alert(response.data[0].message)
          }).catch(error => {
            alert("매수가변경 실패")
            console.log("Failed to updateBuyOrder", error.response);
          });
          return true;
        }else{
          return false;
        }
      }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '매수량', field: 'buy_amount', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
      {headerName: '매도가', field: 'sell_price', valueSetter: params => {
        if(params.data.order_stat === '02' || params.data.order_stat === '05'){       
          params.data.sell_price = params.newValue;
          
          axios({
            method: "GET",
            url: "http://phills2.asuscomm.com:8000/stockOrder/update/",
            params:{
              id: params.data.id,
              order_no: params.data.order_no,
              buy_price: 0,
              sell_price: params.newValue,
              order_amount: params.data.remain_qty,
              acct_no: params.data.acct_no,
              app_key: params.data.app_key,
              app_secret: params.data.app_secret,
              access_token: params.data.access_token
            }
                  
          }).then(response => {
            console.log("Success", response)
            alert("매도가변경 완료")
            if(response.data[0].message != "")
              alert(response.data[0].message)
          }).catch(error => {
            alert("매도가변경 실패")
            console.log("Failed to updateBuyOrder", error.response);
          });
          return true;
        }else{
          return false;
        }
      }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '매도량', field: 'sell_amount', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
      {headerName: '손절가', field: 'loss_price', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '목표가', field: 'target_price', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '매매유형', field: 'trading_type', valueFormatter: (params) => {return params.value === 'B' ? '매수' : params.value === 'S' ? '매도' : ''},},
      {headerName: '주문번호', field: 'order_no'},
      {headerName: '주문상태', field: 'order_stat', valueFormatter: (params) => {return params.value === '01' ? '주문등록' : params.value === '02' ? '주문전송' : params.value === '03' ? '주문체결' : params.value === '04' ? '주문취소' : params.value === '05' ? '주문정정' : ''},},
      {headerName: '체결량', field: 'total_complete_qty', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
      {headerName: '잔여량', field: 'remain_qty', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
    ]);

    const colDefs2 = ref([
      {headerName: 'No', colId: 0, valueGetter: (params) => { return params.node.rowIndex + 1 } },
      {headerName: '주문번호', field: 'order_no'},
      {headerName: '원주문번호', field: 'org_order_no'},
      {headerName: '주문구분', field: 'order_type'},
      {headerName: '주문일자', field: 'order_dt', valueFormatter: (params) => {return params.value.substr(0, 4) + "-" + params.value.substr(4,2) + "-" + params.value.substr(6, 2)},},
      {headerName: '주문시각', field: 'order_tmd', valueFormatter: (params) => {return params.value.substr(0, 2) + ":" + params.value.substr(2,2) + ":" + params.value.substr(4, 2)},},
      {headerName: '종목명', field: 'name', tooltip: true, tolltipField: 'name'},
      {headerName: '주문가', field: 'order_price', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '주문수량', field: 'order_amount', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
      {headerName: '총체결수량', field: 'total_complete_qty', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
      {headerName: '잔여수량', field: 'remain_qty', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
      {headerName: '총체결금액', field: 'total_complete_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
    ]);
    return {
      defaultColDef1,
      colDefs1,
      defaultColDef2,
      colDefs2
    }
  },
  data: () => {
      return {
          popupView1: false,
          popupView2: false,
          popupView3: false,
          popupView4: false,
          popupView5: false,
          rowData1: [],
          rowData2: [],
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
      };
  },
  methods: {
    deleteOrder: function(){
      this.rowData1.forEach(data =>{
        if(data.chk){
          if(data.order_stat === '01'){
            axios({
              method: "DELETE",
              url: url + data.id + "/", // http://phills2.asuscomm.com:8000/kis/stockOrder/1 로 delete 이벤트 전송
            }).then((response) => {
              console.log("Success", response);
              alert("주문삭제 완료")
              this.getOrderCompleteList();
              this.getStockOrderList();
            }).catch((error) => {
              console.log("Failed to deleteOrder", error.response);
              alert("주문삭제 실패")
            });
          }else{
            alert("주문삭제 대상 주문상태가 아닙니다.")
          }
        } 
      })
    },
    cancelOrder: function(){
      this.rowData1.forEach(data =>{
        if(data.chk){
          if(data.order_stat === '02' || data.order_stat === '03' || data.order_stat === '05'){
            let order_price = 0
            if(data.trading_type === 'B'){
              order_price = data.buy_price
            }else{
              order_price = data.sell_price
            }  
            axios({
              method: "GET",
              url: "http://phills2.asuscomm.com:8000/stockOrder/cancel/",
              params:{
                id: data.id,
                order_no: data.order_no,
                order_price: order_price,
                order_amount: data.remain_qty,
                acct_no: data.acct_no,
                app_key: data.app_key,
                app_secret: data.app_secret,
                access_token: data.access_token
              }
            }).then((response) => {
              console.log("Success", response);
              alert("주문취소 완료")
              this.getOrderCompleteList();
              this.getStockOrderList();
            }).catch((error) => {
              console.log("Failed to cancelOrder", error.response);
              alert("주문취소 실패")
            });
          }else{
            alert("주문취소 대상 주문상태가 아닙니다.")
          }
        } 
      })
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
    openPopup5(){
      this.popupView5 = (this.popupView5) ? false : true
    },
    sendLevel: function(level){
      axios({
        method: "GET",
        url: "http://phills2.asuscomm.com:8000/stockMarketMng/list/",
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
        url: "http://phills2.asuscomm.com:8000/stockOrder/send/",
        params:{
          acct_no: this.$route.params.acct_no,
          app_key: this.$route.params.app_key,
          app_secret: this.$route.params.app_secret,
          access_token: this.$route.params.access_token
        }
      }).then(response => {
        alert("주문전송 완료")
        this.rowData1 = response.data;
        if(response.data[0].message != "")
          alert(response.data[0].message)
        console.log("Success", response);
        this.getOrderCompleteList();
        this.getStockOrderList();
      }).catch(error => {
          alert("주문전송 실패")
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
        url: "http://phills2.asuscomm.com:8000/stockOrder/orderList/",
        params:{
          acct_no: this.$route.params.acct_no,
          app_key: this.$route.params.app_key,
          app_secret: this.$route.params.app_secret,
          access_token: this.$route.params.access_token
        }
      }).then(response => {
        console.log("Success1", response);
        this.rowData1 = response.data;
        this.rowData1.forEach(data => {data.acct_no = this.$route.params.acct_no})
        this.rowData1.forEach(data => {data.app_key = this.$route.params.app_key})
        this.rowData1.forEach(data => {data.app_secret = this.$route.params.app_secret})
        this.rowData1.forEach(data => {data.access_token = this.$route.params.access_token})
      }).catch(error => {
        console.log("Failed to get StockOrderList", error.response);
      });
    },
    getOrderCompleteList() {
      axios({
        method: "GET",
        url: "http://phills2.asuscomm.com:8000/stockOrderComplete/",
        params:{
          acct_no: this.$route.params.acct_no,
          app_key: this.$route.params.app_key,
          app_secret: this.$route.params.app_secret,
          access_token: this.$route.params.access_token
        }
      }).then(response => {
        console.log("Success2", response);
        this.rowData2 = response.data;
      }).catch(error => {
        alert("처리 에러")
        console.log("Failed to get OrderCompleteList", error.response);
      });
    },
  },
  created(){
    this.getOrderCompleteList();
    this.getStockOrderList();
  }
});

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