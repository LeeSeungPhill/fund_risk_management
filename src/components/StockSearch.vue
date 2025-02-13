<template>
  <div>
      <v-container fluid>
          <v-row no-gutter>
              <v-col align="right">
                <v-subheader>
                  [종목 검색]
                </v-subheader>
              </v-col>
              <v-col align="right">
                <v-btn @click="runStockSearch('0')" style="background: rgb(255, 0, 195)">[거래폭발]</v-btn>
                <v-btn @click="runStockSearch('1')" style="background: rgb(195, 0, 255)">[단기추세]</v-btn>
                <v-btn @click="runStockSearch('2')" style="background: rgb(135, 0, 135)">[투자혁명]</v-btn>
              </v-col>
          </v-row>    
          <v-row no-gutter>      
              <v-col align="left">
                  [검색일자]
                  <Datepicker v-model="picked" :locale="locale" :weekStartsOn="0" :inputFormat="inputFormat" :clearable="true"/>
              </v-col>
              <v-col align="right">    
                  [검색조건]
                  <select v-model="selected1" @change="fetchData()">
                      <option v-for="(d, i) in options1" :key="i" :value="d.value">
                      {{ d.text }}
                      </option>
                  </select>
                  [종목명]
                  <input type="text" @change="input"/>
                  <button @click="fetchData">찾기</button>
              </v-col>
          </v-row>
          <v-row>
              <v-col>
                <ag-grid-vue 
                  style="width: 100%; height: 300px;" 
                  class="ag-theme-balham" 
                  :columnDefs="colDefs" 
                  :rowData="rowData" 
                  :paginationAutoPageSize="true"
                  :pagination="true"
                  :defaultColDef="defaultColDef"
                  :tooltipShowDelay="tooltipShowDelay"
                  :tooltipHideDelay="tooltipHideDelay"
                  @cellClicked="onCellClicked"
                />
              </v-col>
          </v-row>
      </v-container>
  </div>    
  </template>
  <script>
    import Datepicker from 'vue3-datepicker';
    import { ref, reactive, onBeforeMount, defineComponent } from 'vue';
    import {ko} from 'date-fns/locale';
    import axios from "axios";
    import {AgGridVue} from 'ag-grid-vue3';
    import 'ag-grid-community/styles/ag-grid.css';
    import 'ag-grid-community/styles/ag-theme-balham.css';
    import 'ag-grid-community/styles/ag-theme-quartz.css';

    const host = process.env.VUE_APP_BASE_URL
  
    export default defineComponent({
      name: 'App',
      components:{
        Datepicker,   
        AgGridVue,
      },
      setup(){
        const picked = ref(new Date());
        const locale = reactive(ko);
        const inputFormat = ref('yyyy-MM-dd');
        const tooltipShowDelay = ref(null);
        const tooltipHideDelay = ref(null);
        
        const defaultColDef = ref({
          flex: 1,
          //editable: true,
          minWidth: 100,
        });
  
        onBeforeMount(() => {
          tooltipShowDelay.value = 0;
          tooltipHideDelay.value = 2000;
        });
        
        const colDefs = ref([
            /* {headerName: 'No', field: 'no'}, */
            {headerName: 'No', colId: 0, valueGetter: (params) => { return params.node.rowIndex + 1 } },
            {headerName: '검색일시', field: 'search_dtm', tolltipField: 'search_dtm'},
            {headerName: '검색명', field: 'search_name', tooltipField: 'search_name'},
            {headerName: '종목코드', field: 'code', /* onCellClicked: (event) => {
              axios({
                method: "GET",
                url: "http://phills2.asuscomm.com:8000/stockOrder/chart/",
                params:{
                  code: event.node.data.code.trim(),
                  company: event.node.data.name.trim(),
                }
                              
              }).then(response => {
                console.log("Success", response)
                charturl = "http://phills2.asuscomm.com:8000/stockOrder/"+response.data[0].name+"/"
                window.open(charturl, "PopupWin", "width=1000,height=1000", true); 
                charturl = null
              }).catch(error => {
                alert("처리 에러")
                console.log("Failed to doInfo", error.response);
              }); 
              if(charturl != null) 
                window.open(charturl, "PopupWin", "width=1000,height=1000", true); 
            }, */},
            {headerName: '종목명', field: 'name', tooltipField: 'name'},
            {headerName: '현재가', field: 'current_price', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '고가', field: 'high_price', editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '저가', field: 'low_price', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '등락률', field: 'day_rate', valueFormatter: (params) => {return  params.value.toLocaleString() + '%';},},
            {headerName: '거래량', field: 'volumn', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
            {headerName: '거래량비율', field: 'volumn_rate', valueFormatter: (params) => {return  params.value.toLocaleString() + '%';},},
            {headerName: '시가총액', field: 'market_total_sum', valueFormatter: (params) => {return params.value.toLocaleString() + '억원';},},
        ]);
  
        return {
          picked,
          locale,
          inputFormat,
          defaultColDef,
          tooltipShowDelay,
          tooltipHideDelay,
          colDefs,
        }
      },
      data() {
        return {
            rowData: [],
            selected1: '',
            inputText: '',
            columnApi: null,
            
            options1: [
              { text: '---------------', value: '' },
              { text: '거래폭발', value: '거래폭발' },
              { text: '단기추세', value: '단기추세' },          
              { text: '투자혁명', value: '투자혁명' }
            ],
            data: {
              search_day: null,
              search_name: null,
              name: null,
            }
          };
      },
      computed: {
  
      },
      beforemount () {
  
      },
      methods : {
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
  
        runStockSearch: function(id) { 
          axios({
            method: "GET",
            url: host + "/stockOrder/runStockSearch/",
            params: {
              search_choice: id,
              acct_no: this.$route.params.acct_no,
              app_key: this.$route.params.app_key,
              app_secret: this.$route.params.app_secret,
              access_token: this.$route.params.access_token
            }
          }).then(response => {
            console.log("Success", response)
            alert("종목검색 완료")
            this.rowData = response.data;
            let seqno = 1
            this.rowData.forEach(data => {data.no = seqno++})
            this.rowData.forEach(data => {data.acct_no = this.$route.params.acct_no})
            this.rowData.forEach(data => {data.app_key = this.$route.params.app_key})
            this.rowData.forEach(data => {data.app_secret = this.$route.params.app_secret})
            this.rowData.forEach(data => {data.access_token = this.$route.params.access_token})
          }).catch(error => {
            alert("종목검색 에러")
            console.log("Failed to get StockFundMng", error.response);
          });
        },
        fetchData: function(){
          const date1 = new Date(this.picked);
          let year = date1.getFullYear();
          let mon = date1.getMonth()+1
          let month = date1.getMonth() < 10 ? '0' + mon : mon
          let day = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()
  
          axios({
            method: "GET",
            url: host + "/stockOrder/stockSearch/",
            params:{
              search_day: year.toString()+month.toString()+day.toString(),
              search_name: this.selected1,
              name: this.inputText
            }
            
          }).then(response => {
            console.log("Success", response.data)
            this.rowData = response.data;
            let seqno = 1
            this.rowData.forEach(data => {data.no = seqno++})
            this.rowData.forEach(data => {data.acct_no = this.$route.params.acct_no})
            this.rowData.forEach(data => {data.app_key = this.$route.params.app_key})
            this.rowData.forEach(data => {data.app_secret = this.$route.params.app_secret})
            this.rowData.forEach(data => {data.access_token = this.$route.params.access_token})
          }).catch(error => {
            alert("처리 에러")
            console.log("Failed to fetchData", error.response);
          });
        },
        input(e){
          return this.inputText = e.target.value
          //input에 입력된 값을 inputText로 넣어주기
        },
        created() { 
          this.fetchData();
        }
      }
    });
    
  </script>