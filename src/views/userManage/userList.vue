<template>
  <div>
    <!-- 搜索 -->
		<div class="search-area">
			<el-form
        label-position="right"
        label-width="80px"
        ref="searchForm"
        :model="searchForm"
        :inline="true"
        :rules="searchRules">
				<el-form-item class="search-form-item" label="姓名">
					<el-input placeholder="姓名" v-model="searchForm.userName"></el-input>
				</el-form-item>
				<el-form-item class="search-form-item" label="手机号码" prop="userMobile">
					<el-input placeholder="手机号码" v-model="searchForm.userMobile"></el-input>
				</el-form-item>
				<el-form-item class="search-form-item" label="身份证号" prop="userIdentity">
					<el-input placeholder="身份证号" v-model="searchForm.userIdentity"></el-input>
				</el-form-item>
				<el-form-item class="search-form-item" label="状态">
					<el-select placeholder="状态" v-model="searchForm.state">
						<el-option label="已确认授权" value="0"></el-option>
            <el-option label="用户未提交" value="1"></el-option>
            <el-option label="正在获取数据" value="2"></el-option>
            <el-option label="数据已获取" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="search-form-item" label="类型">
			    <el-select placeholder="类型" v-model="searchForm.typeId">
			    	<el-option label="公积金" value="1"></el-option>
			    	<el-option label="地税" value="2"></el-option>
			    	<el-option label="移动" value="3"></el-option>
			    </el-select>
				</el-form-item>
				<el-row>
					<el-form-item>
            <el-button @click.native="handleSearch">查询</el-button>
				    <el-button @click.native="handleResetSearchForm">重置</el-button>
				    <el-button type="primary" @click.native="handleAddNew">新增</el-button>
					</el-form-item>
				</el-row>
			</el-form>
		</div>

    <!-- 列表 -->
		<div class="table-area" v-loading="searchLoading">
			<el-table :data="tableData" border>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column label="姓名" width="80" prop="customer_realName"></el-table-column>
				<el-table-column label="手机号码" width="150" prop="customer_mobile"></el-table-column>
        <el-table-column label="身份证号码" width="200" prop="customer_identity"></el-table-column>
        <el-table-column label="日期" width="200" inline-template>
          <span>{{row.credit_time | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
        </el-table-column>
        <el-table-column label="类型" inline-template>
        	<el-tag  :type="getTagType(row.code_info)">
            {{row.code_info}}
          </el-tag>
        </el-table-column>
        <el-table-column label="状态" width="150" :formatter="formatState"></el-table-column>
        <el-table-column label="操作" inline-template>
        	<div>
            <!-- credit_state
            0: 用户已确认授权
            1: 用户未提交
            2：正在爬取数据
            3：数据已爬取  -->
        		<el-button
              size="small"
              type="danger"
              v-if="row.credit_state === 1"
              @click.native="handleDelCustomer(row)">删除</el-button>
            <el-button
              size="small"
              type="primary"
              v-if="row.credit_state === 0 || row.credit_state === 3"
              @click.native="handleCheckDetail(row)">查看</el-button>
        	</div>
        </el-table-column>
			</el-table>
      <el-pagination
        class="form-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="searchData.pageSize"
        :page-sizes="[5, 10, 15, 20, 25, 30]"
        :currentPage="searchData.pageNum"
        :total="pageTotal"
        layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
		</div>

    <!-- 新增 -->
    <el-dialog
      size="small"
      title="新增"
      v-model="addNewFormVisible"
      :close-on-click-modal="false">
      <el-form label-width="100px" :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="姓名" class="dialog-form-item" prop="customer_realName">
          <el-input placeholder="姓名" v-model="addForm.customer_realName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" class="dialog-form-item" prop="customer_mobile">
          <el-input placeholder="手机号" v-model="addForm.customer_mobile"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" class="dialog-form-item" prop="customer_identity">
          <el-input placeholder="身份证号" v-model="addForm.customer_identity"></el-input>
        </el-form-item>
        <el-form-item label="类型" class="dialog-form-item" prop="type_id">
          <el-radio-group v-model="addForm.type_id">
            <el-radio label="1">公积金</el-radio>
            <el-radio label="2" disabled>地税</el-radio>
            <el-radio label="3" disabled>移动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" class="dialog-form-item" prop="customer_info">
          <el-input type="textarea" placeholder="备注" v-model="addForm.customer_info"></el-input>
        </el-form-item>
        <el-form-item class="dialog-form-button-group">
          <el-button @click.native="addNewFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="handleAddConfirm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
	</div>
</template>

<script>
import { creditMaps } from 'common/maps';
import { getCreditList, addCustomer, delCustomer } from 'common/api';
import validateID from 'verify-identity-card';
import util from 'common/util';

export default{
  name: 'userList',

  data() {
    const mobile = (rule, value, callback) => {
      const pattern = /^1[34578]\d{9}$/;
      if (value !== '' && !pattern.test(value)) {
        callback(new Error('手机号码输入不正确'));
      } else {
        callback();
      }
    };

    const identityCard = (rule, value, callback) => {
      if (value !== '' && !validateID(value)) {
        callback(new Error('身份证号输入有误'));
      } else {
        callback();
      }
    };

    return {
      tableData: [],

      searchForm: {
        userName: '',
        userMobile: '',
        userIdentity: '',
        state: '',
        typeId: '',
      },
      searchRules: {
        userMobile: [
          { validator: mobile, trigger: 'change' },
        ],
        userIdentity: [
          { validator: identityCard, trigger: 'change' },
        ],
      },
      searchData: {
        pageSize: 10,
        pageNum: 1,
      },

      addForm: {
        customer_realName: '',
        customer_identity: '',
        customer_mobile: '',
        customer_info: '',
        type_id: '',
      },
      addRules: {
        customer_realName: [
          { required: true, message: '请输入姓名', trigger: 'change' },
        ],
        customer_mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: mobile, trigger: 'change' },
        ],
        customer_identity: [
          { required: true, message: '请输入身份证号码', trigger: 'change' },
          { validator: identityCard, trigger: 'change' },
        ],
        type_id: [
          { required: true, message: '请选择类型', trigger: 'change' },
        ],
      },

      pageTotal: 0,
      addNewFormVisible: false,

      searchLoading: false,
    };
  },
  methods: {
    getTagType(name) {
      return creditMaps.tagTypeMap[name] || '';
    },
    formatState(row) {
      return creditMaps.stateMap[row.credit_state] || '';
    },
    handleSearch() {
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          this.searchData = Object.assign(this.searchData, this.searchForm);
          if (this.searchData.pageNum === 1) {
            this.getAllCreditList();
          } else {
            this.searchData.pageNum = 1;
          }
        }
      });
    },
    handleResetSearchForm() {
      util.resetForm(this.searchForm);
      setTimeout(() => this.$refs.searchForm.resetFields(), 0);
    },
    handleSizeChange(size) {
      this.searchData.pageSize = size;
    },
    handleCurrentChange(num) {
      this.searchData.pageNum = num;
    },
    handleCheckDetail(row) {
      this.$router.push({
        path: 'userDetail',
        query: {
          credit_flow: row.credit_flow,
          type: row.code_info,
        },
      });
    },
    handleAddNew() {
      this.addNewFormVisible = true;
    },
    handleAddConfirm() {
      this.$refs.addForm.validate((isValid) => {
        if (isValid) {
          this.addNewFormVisible = false;
          addCustomer(this.addForm)
            .then(({ body }) => {
              if (body.responseStatus === '0') {
                util.resetForm(this.addForm);
                setTimeout(() => this.$refs.addForm.resetFields(), 0);
                this.getAllCreditList();
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '添加成功',
                });
              }
            });
        }
      });
    },
    handleDelCustomer(row) {
      this.$confirm('确认删除用户?', '提示', { type: 'warning' })
        .then(() => delCustomer({ credit_flow: row.credit_flow }))
        .then(({ body }) => {
          if (body.responseStatus === '0') {
            this.getAllCreditList();
            this.$notify({
              type: 'success',
              title: '成功',
              message: '删除成功',
            });
          }
        });
    },
    getAllCreditList() {
      this.searchLoading = true;
      getCreditList(this.searchData)
        .then(({ body }) => {
          if (body.responseStatus === '0') {
            this.pageTotal = body.object.total;
            this.tableData = body.object.list;
          }
        })
        .finally(() => {
          this.searchLoading = false;
        });
    },
  },
  watch: {
    'searchData.pageSize': function () {
      this.getAllCreditList();
    },
    'searchData.pageNum': function () {
      this.getAllCreditList();
    },
  },
  created() {
    this.getAllCreditList();
  },
};
</script>

<style lang="scss" scoped>
</style>
