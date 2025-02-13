<template>
  <div>
    <v-container>
        <v-row>
          <v-col align="center" colspan="2">
            <v-subheader>
              [장중 투자자별 매매 상위 - {{this.yyyy}} {{this.mm}} {{this.dd}} {{this.hour}} {{this.minute}} 기준]
            </v-subheader>
          </v-col>
        </v-row>
        <v-row>
          <v-col colspan="2" align="center" >
            [매매유형]
            <select v-model="selected1" @change="fetchData">
              <option v-for="(d, i) in options1" :key="i" :value="d.value">
                {{ d.text }}
              </option>
            </select>
            [시장구분]
            <select v-model="selected2" @change="fetchData">
              <option v-for="(d, i) in options2" :key="i" :value="d.value">
                {{ d.text }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="left" >[기관]</v-col>
          <v-col align="left" >[외국인]</v-col>
        </v-row>  
        <v-row>
          <v-col align="center" >
            <ag-grid-vue 
                  style="width: 100%; height: 350px;" 
                  class="ag-theme-balham" 
                  :columnDefs="colDefs1" 
                  :rowData="rowData1" 
                  :paginationAutoPageSize="true"
                  :pagination="true"
                  :defaultColDef="defaultColDef1"
                  :tooltipShowDelay="tooltipShowDelay"
                  :tooltipHideDelay="tooltipHideDelay"
                  @cellClicked="onCellClicked"
            />
          </v-col>
          <v-col align="center" >
            <ag-grid-vue 
                  style="width: 100%; height: 350px;" 
                  class="ag-theme-balham" 
                  :columnDefs="colDefs2" 
                  :rowData="rowData2" 
                  :paginationAutoPageSize="true"
                  :pagination="true"
                  :defaultColDef="defaultColDef2"
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
  import { ref, onBeforeMount, defineComponent } from 'vue';
  import axios from "axios";
  import {AgGridVue} from 'ag-grid-vue3';
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-balham.css';
  import 'ag-grid-community/styles/ag-theme-quartz.css';

  const host = process.env.VUE_APP_BASE_URL

  export default defineComponent({
  name: 'App',
  components:{
    AgGridVue
  },
  setup(){

    const tooltipShowDelay = ref(null);
    const tooltipHideDelay = ref(null);

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

    onBeforeMount(() => {
      tooltipShowDelay.value = 0;
      tooltipHideDelay.value = 2000;
    });

    const colDefs1 = ref([
      {headerName: 'No', colId: 0, valueGetter: (params) => { return params.node.rowIndex + 1 } },
      {headerName: '종목코드', field: 'code'},
      {headerName: '종목명', field: 'name', tooltipField: 'name'},
      {headerName: '수급주체', field: 'tr_subject'},
      {headerName: '순거래합산', field: 'volumn', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
    ]);

    const colDefs2 = ref([
      {headerName: 'No', colId: 0, valueGetter: (params) => { return params.node.rowIndex + 1 } },
      {headerName: '종목코드', field: 'code'},
      {headerName: '종목명', field: 'name', tooltipField: 'name'},
      {headerName: '수급주체', field: 'tr_subject'},
      {headerName: '순거래합산', field: 'volumn', valueFormatter: (params) => {return params.value.toLocaleString() + '주';},},
    ]);

    return {
      defaultColDef1,
      colDefs1,
      defaultColDef2,
      colDefs2,
      tooltipShowDelay,
      tooltipHideDelay,
    }
  },  
  data() {
      return {
          result: null,
          rowData1: [],
          rowData2: [],
          yyyy: null,
          mm: null,
          dd: null,
          hour: null,
          minute: null,
          charturl: null,
          selected1: '순매수',
          options1: [
            { text: '순매수', value: '순매수' },
            { text: '순매도', value: '순매도' }          
          ],
          selected2: '코스피',
          options2: [
            { text: '코스피', value: '코스피' },
            { text: '코스닥', value: '코스닥' }          
          ],  
          data: {
            tr_subject: null,
            tr_type: null,
            market_type: null,
          }
        };
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
      fetchData: function(){
        axios({
          method: "GET",
          url: host + "/stockOrder/subTotal/",
          params:{
            tr_subject: '기관',
            tr_type: this.selected1,
            market_type: this.selected2            
          }
          
        }).then(response => {
          console.log("Success", response.data)
          this.rowData1 = response.data;
          this.yyyy = response.data[0].tr_day.substr(0,4) + "년";
          this.mm = response.data[0].tr_day.substr(4,2) + "월";
          this.dd = response.data[0].tr_day.substr(6,2) + "일";
          this.hour = response.data[0].tr_time.substr(0,2) + "시";
          this.minute = response.data[0].tr_time.substr(2,2) + "분";
          this.rowData1.forEach(data => {data.acct_no = this.$route.params.acct_no})
          this.rowData1.forEach(data => {data.app_key = this.$route.params.app_key})
          this.rowData1.forEach(data => {data.app_secret = this.$route.params.app_secret})
          this.rowData1.forEach(data => {data.access_token = this.$route.params.access_token})
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to fetchData", error.response);
        });
        axios({
          method: "GET",
          url: host + "/stockOrder/subTotal/",
          params:{
            tr_subject: '외국인',
            tr_type: this.selected1,
            market_type: this.selected2            
          }
          
        }).then(response => {
          console.log("Success", response.data)
          this.rowData2 = response.data;
          this.rowData2.forEach(data => {data.acct_no = this.$route.params.acct_no})
          this.rowData2.forEach(data => {data.app_key = this.$route.params.app_key})
          this.rowData2.forEach(data => {data.app_secret = this.$route.params.app_secret})
          this.rowData2.forEach(data => {data.access_token = this.$route.params.access_token})
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to fetchData", error.response);
        });
      },
    },
    created() { 
      this.fetchData();
    }
  });
</script>
  

  
  
  