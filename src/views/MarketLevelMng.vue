<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col align="center">
          <v-subheader>
            [시장 레벨 관리]
          </v-subheader>
        </v-col>
      </v-row>
      <ag-grid-vue 
        style="width: 100%; height: 300px;" 
        class="ag-theme-balham" 
        :columnDefs="colDefs" 
        :rowData="rowData" 
        :paginationAutoPageSize="true"
        :pagination="true"
        :defaultColDef="defaultColDef"
      />
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
let url = host + "/stockMarketMng/list/"; //장고 서버 주소

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
    {headerName: 'No', colId: 0, valueGetter: (params) => { return params.node.rowIndex + 1 } },
    {headerName: '리스크번호', field: 'asset_risk_num'},
    {headerName: '시장레벨', field: 'market_level_num'},
    {headerName: '총자산', field: 'total_asset', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
    {headerName: '리스크', field: 'risk_rate', valueFormatter: (params) => {return  params.value.toLocaleString() + '%';},},
    {headerName: '리스크 금액', field: 'risk_sum', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
    {headerName: '종목수', field: 'item_number', valueFormatter: (params) => {return  params.value.toLocaleString() + '개';},},
    {headerName: '종목당 리스크', field: 'item_risk_sum', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
    {headerName: '적용시작일', field: 'aply_start_dt', valueFormatter: (params) => {return params.value.substr(0, 4) + "-" + params.value.substr(4,2) + "-" + params.value.substr(6, 2)},},
    {headerName: '적용종료일', field: 'aply_end_dt', valueFormatter: (params) => {return params.value.substr(0, 4) + "-" + params.value.substr(4,2) + "-" + params.value.substr(6, 2)},},
  ]);

  return {
    defaultColDef,
    colDefs
  }
},
data: () => {
  return {
    rowData: [],
    acct_no: null,
    app_key: null,
    app_secret: null,
    access_token: null,
  };
},
methods: {
  formatDate(str){
    return str.split('T')[0];
  },
  getLevel(){
    axios({
      method: "GET",
      url: url,
      params: {
        acct_no: this.$route.params.acct_no,
        app_key: this.$route.params.app_key,
        app_secret: this.$route.params.app_secret,
        access_token: this.$route.params.access_token
      }
    }).then(response => {
      this.rowData = response.data;
      console.log("Success", response)
    }).catch(error => {
      alert("처리 에러")
      console.log("Failed to get StockMarketLevelMng", error.response);
    });
  }
},
created(){
  this.getLevel();
}
});

</script>