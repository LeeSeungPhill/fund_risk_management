<template>
  <div>
    <v-container fluid>
        <v-row>
          <v-col align="center">
            <v-subheader>
              [잔고 종목]
            </v-subheader>
          </v-col>
        </v-row>
        <div class="grid-wrapper">
          <ag-grid-vue 
            class="ag-theme-balham" 
            :columnDefs="colDefs" 
            :rowData="rowData" 
            :paginationAutoPageSize="true"
            :pagination="true"
            :defaultColDef="defaultColDef"
            @cellClicked="onCellClicked"
          />
      </div>
    </v-container>      
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue';
import axios from "axios";
import {AgGridVue} from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const host = process.env.VUE_APP_BASE_URL
let url = host + "/stockBalance/balanceList/"; //장고 서버 주소

export default defineComponent({
  name: 'App',
  components:{
    AgGridVue
  },
  setup(){

    const defaultColDef = ref({
      flex: 1,
      minWidth: 100,
      //editable: true,
    });

    const colDefs = ref([
      {headerName: 'No', colId: 0, valueGetter: (params) => { return params.node.rowIndex + 1 }, width: 30},
      {headerName: '종목코드', field: 'code', width: 60},
      {headerName: '종목명', field: 'name', width: 120},
      {headerName: '매입가', field: 'purchase_price', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();}, width: 80},
      {headerName: '현재가', field: 'current_price', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},
      {headerName: '수익률', field: 'earnings_rate', valueFormatter: (params) => {return  params.value.toLocaleString() + '%';},width: 80},
      {headerName: '매매계획', field: 'trading_plan', valueFormatter: (params) => {
                                                                                  const planMap = {
                                                                                    '20s': '20% 매도',
                                                                                    '25s': '25% 매도',
                                                                                    '33s': '33% 매도',
                                                                                    '50s': '50% 매도',
                                                                                    '66s': '66% 매도',
                                                                                    'as': '전량매도',
                                                                                    '1b': '1차 매수',
                                                                                    '2b': '2차 매수',
                                                                                    '3b': '3차 매수',
                                                                                    '4b': '4차 매수',
                                                                                    '5b': '5차 매수',
                                                                                    'h': '홀딩',
                                                                                    'i': '투자'
                                                                                  };
                                                                                  return planMap[params.value] || params.value || '';
                                                                                }, valueSetter: params => {
                                                                                  params.data.trading_plan = params.newValue;

                                                                                  axios({
                                                                                          method: "GET",
                                                                                          url: host + "/stockBalance/update/",
                                                                                          params:{
                                                                                            id: params.data.id,
                                                                                            code: params.data.code,
                                                                                            sign_resist_price: params.data.sign_resist_price,
                                                                                            sign_support_price: params.data.sign_support_price,
                                                                                            end_target_price: params.data.end_target_price,
                                                                                            end_loss_price: params.data.end_loss_price,
                                                                                            trading_plan: params.newValue,
                                                                                            limit_amt: params.data.limit_amt
                                                                                          }
                                                                                          
                                                                                          }).then(response => {
                                                                                            console.log("Success", response)
                                                                                          }).catch(error => {
                                                                                            alert("처리 에러")
                                                                                            console.log("Failed to updateItem1", error.response);
                                                                                          });
                                                                                          return true;
      }, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: {values:['20s', '25s', '33s', '50s', '66s', 'as', '1b', '2b', '3b', '4b', '5b', 'h', 'i']},width: 50},
      {headerName: '저항가격', field: 'sign_resist_price', cellStyle: params=> {
        if(params.data.K_sign_resist_price === '1' ) {
          return {color:'orange', 'font-weight': 'bold'}
        }
      }, valueSetter: params => {
                
        params.data.sign_resist_price = params.newValue;

        axios({
                method: "GET",
                url: host + "/stockBalance/update/",
                params:{
                  id: params.data.id,
                  code: params.data.code,
                  sign_resist_price: params.newValue,
                  sign_support_price: params.data.sign_support_price,
                  end_target_price: params.data.end_target_price,
                  end_loss_price: params.data.end_loss_price,
                  trading_plan: params.data.trading_plan,
                  limit_amt: params.data.limit_amt
                }
                
                }).then(response => {
                  console.log("Success", response)
                }).catch(error => {
                  alert("처리 에러")
                  console.log("Failed to updateItem1", error.response);
                });
                return true;
      }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},
      {headerName: '지지가격', field: 'sign_support_price', cellStyle: params=> {
        if(params.data.D_sign_support_price === '1' ) {
          return {color:'skyblue', 'font-weight': 'bold'}
        }
      }, valueSetter: params => {
                
        params.data.sign_support_price = params.newValue;

        axios({
                method: "GET",
                url: host + "/stockBalance/update/",
                params:{
                  id: params.data.id,
                  code: params.data.code,
                  sign_resist_price: params.data.sign_resist_price,
                  sign_support_price: params.newValue,
                  end_target_price: params.data.end_target_price,
                  end_loss_price: params.data.end_loss_price,
                  trading_plan: params.data.trading_plan,
                  limit_amt: params.data.limit_amt
                }
                
                }).then(response => {
                  console.log("Success", response)
                }).catch(error => {
                  alert("처리 에러")
                  console.log("Failed to updateItem1", error.response);
                });
                return true;
      }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},
      {headerName: '목표가격', field: 'end_target_price', cellStyle: params=> {
        if(params.data.K_target_price === '1' ) {
          return {color:'red', 'font-weight': 'bold'}
        }
      }, valueSetter: params => {
                
        params.data.end_target_price = params.newValue;

        axios({
                method: "GET",
                url: host + "/stockBalance/update/",
                params:{
                  id: params.data.id,
                  code: params.data.code,
                  sign_resist_price: params.data.sign_resist_price,
                  sign_support_price: params.data.sign_support_price,
                  end_target_price: params.newValue,
                  end_loss_price: params.data.end_loss_price,
                  trading_plan: params.data.trading_plan,
                  limit_amt: params.data.limit_amt
                }
                
                }).then(response => {
                  console.log("Success", response)
                }).catch(error => {
                  alert("처리 에러")
                  console.log("Failed to updateItem1", error.response);
                });
                return true;
      }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},
      {headerName: '이탈가격', field: 'end_loss_price', cellStyle: params=> {
        if(params.data.D_loss_price === '1' ) {
          return {color:'blue', 'font-weight': 'bold'}
        }
      }, valueSetter: params => {
                
        params.data.end_loss_price = params.newValue;

        axios({
                method: "GET",
                url: host + "/stockBalance/update/",
                params:{
                  id: params.data.id,
                  code: params.data.code,
                  sign_resist_price: params.data.sign_resist_price,
                  sign_support_price: params.data.sign_support_price,
                  end_target_price: params.data.end_target_price,
                  end_loss_price: params.newValue,
                  trading_plan: params.data.trading_plan,
                  limit_amt: params.data.limit_amt
                }
                
                }).then(response => {
                    console.log("Success", response)
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem1", error.response);
                });
                return true;
      }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},
      {headerName: '거래량비율', field: 'prdy_vol_rate', valueFormatter: (params) => {return  params.value.toLocaleString() + '%';},width: 80},
      {headerName: '손절가', field: 'limit_price', cellStyle: params=> {
        if(params.data.D_limit_price === '1' ) {
          return {color:'blueviolet', 'font-weight': 'bold'}
        }
      },valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},
      {headerName: '손절금액', field: 'limit_amt', valueSetter: params => {
                
        params.data.limit_amt = params.newValue;

        axios({
                method: "GET",
                url: host + "/stockBalance/update/",
                params:{
                  id: params.data.id,
                  code: params.data.code,
                  sign_resist_price: params.data.sign_resist_price,
                  sign_support_price: params.data.sign_support_price,
                  end_target_price: params.data.end_target_price,
                  end_loss_price: params.data.end_loss_price,
                  trading_plan: params.data.trading_plan,
                  limit_amt: params.newValue
                }
                
                }).then(response => {
                  console.log("Success", response)
                }).catch(error => {
                  alert("처리 에러")
                  console.log("Failed to updateItem1", error.response);
                });
                return true;
      }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},      
      {headerName: '보유수량', field: 'purchase_amount', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},width: 80},
      {headerName: '매도가능수량', field: 'avail_amount', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},width: 80},
      {headerName: '매입총액', field: 'purchase_sum', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},
      {headerName: '평가금액', field: 'eval_sum', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},
      {headerName: '증감액', field: 'valuation_sum', cellStyle: params=> {
        if(Number(params.data.valuation_sum) > 0) {
          return {color:'mediumvioletred', 'font-weight': 'bold'}
        }
      },valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},width: 80},
      {headerName: '시가총액', field: 'total_market_value', valueFormatter: (params) => {return params.value.toLocaleString() + '억원';},width: 80},
    ]);

    return {
      defaultColDef,
      colDefs
    }
  },
  data() {
    return {
        rowData: [],
        charturl: null,
        data: {
          sign_resist_price: "",
          sign_support_price: "",
          end_loss_price: "",
          end_target_price: "",
          trading_plan: "",
        },
    };
  },
  methods: {
    onCellClicked: (e) =>{
      let charturl = null;
                
      if(e.column.colId === 'code'){
        axios({
          method: "GET",
          url: host + "/stockOrder/chart/",
          params:{
            code: e.data.code.trim(),
            company: e.data.name.trim(),
          }
                                                
        }).then(response => {
          console.log("Success", response)
          charturl = host + "/stockOrder/"+response.data[0].name+"/"
          window.open(charturl, "PopupWin", "width=1000,height=1000", true);
          charturl = null
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to doInfo", error.response);
        }); 
        if(charturl != null) 
          window.open(charturl, "PopupWin", "width=1000,height=1000", true);
      }    

      if(e.column.colId === 'name'){  
        axios({
          method: "GET",
          url: host + "/stockOrder/minutesInfo/",
          params:{
            code: e.data.code.trim(),
            company: e.data.name.trim(),
            app_key: e.data.app_key,
            app_secret: e.data.app_secret,
            access_token: e.data.access_token
          }
                                    
        }).then(response => {
          console.log("Success", response)
          charturl = host + "/stockOrder/minutes_"+response.data[0].name+"/"
          window.open(charturl, "PopupWin", "width=1000,height=1000", true);
          charturl = null
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to minutesInfo", error.response);
        }); 
        if(charturl != null) 
          window.open(charturl, "PopupWin", "width=1000,height=1000", true);
      }
    },     
    fetchData(){
      axios({
      method: "GET",
      url: url,
      params:{
        acct_no: this.$route.params.acct_no,
        app_key: this.$route.params.app_key,
        app_secret: this.$route.params.app_secret,
        access_token: this.$route.params.access_token
      }
    })
    .then(response => {
      console.log('Success', response.data)
      this.rowData = response.data;
      this.rowData.forEach(data => {data.acct_no = this.$route.params.acct_no})
      this.rowData.forEach(data => {data.app_key = this.$route.params.app_key})
      this.rowData.forEach(data => {data.app_secret = this.$route.params.app_secret})
      this.rowData.forEach(data => {data.access_token = this.$route.params.access_token})
    })
    .catch(error => {
      console.log(error)
    })
    },
    marketReg(){
      axios({
      method: "GET",
      url: host + "/stockFundMng/marketReg/",
      params:{
        acct_no: this.$route.params.acct_no,
        app_key: this.$route.params.app_key,
        app_secret: this.$route.params.app_secret,
        access_token: this.$route.params.access_token
      }
    })
    .then(response => {
      console.log('trail_signal:', response.data)
    })
    .catch(error => {
      console.log(error)
    })
    },
    riskReg(){
      axios({
      method: "GET",
      url: host + "/stockMarketMng/list/",
      params:{
        acct_no: this.$route.params.acct_no,
        app_key: this.$route.params.app_key,
        app_secret: this.$route.params.app_secret,
        access_token: this.$route.params.access_token
      }
    })
    .then(response => {
      console.log('market_mng :', response.data)
    })
    .catch(error => {
      console.log(error)
    })
    }
  },
  created() { 
    this.fetchData();
    this.marketReg();
    this.riskReg();
  }

  
});
</script>
<style scoped>
.grid-wrapper {
  height: 630px;
}
.ag-theme-balham {
  height: 100%;
  width: 100%;
}
.up {
    font-weight: bold;
    color: red;
}
.down {
  font-weight: bold;
  color: blue;
}
</style>