<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="搜索Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="账户状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in standardStatusOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.sex" placeholder="性别" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in standardSexOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{ props.row.person.name }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.sex.name }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>
                <template>
                  <el-tag :type="props.row.status.id | statusFilter">
                    {{ props.row.status.name }}
                  </el-tag>
                </template>
              </span>
            </el-form-item>
            <el-form-item label="email">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.person.address }}</span>
            </el-form-item>
            <el-form-item label="手机号">
              <span>{{ props.row.person.telephone }}</span>
            </el-form-item>
            <el-form-item label="头像">
              <span>
                <template>
                  <el-avatar :size="40" :src="props.row.person.avatar"></el-avatar>
                </template>
              </span>
            </el-form-item>
            <el-form-item label="个人简介">
              <span>{{ props.row.person.introduction }}</span>
            </el-form-item>
            <el-form-item label="角色">
              <span v-for="item in props.row.roles" :key="item.id" style="margin-left:5px;margin-right:5px">
                <template>
                  <el-tag size="mini" type="info">
                    {{ item.name }}
                  </el-tag>
                </template> </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="姓名" prop="person.name" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.person.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.sex.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="账户状态" class-name="status-col" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.status.id | statusFilter">
            {{ row.status.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Email" prop="email" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status.id!='2'" size="mini" type="success" @click="handleModifyStatus(row,2,'禁止登陆')">
            禁止
          </el-button>
          <el-button v-if="row.status.id!='1'" size="mini" @click="handleModifyStatus(row,1,'正常')">
            恢复
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.offset" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:70px;">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="temp.name" clearable placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create' " label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="再次输入密码" prop="repassword">
          <el-input v-model="temp.repassword" placeholder="请再次输入密码" show-password />
        </el-form-item>
        <el-form-item label="姓名" prop="person.name">
          <el-input v-model="temp.person.name" clearable placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex.id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in standardSexOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="person.address">
          <el-input v-model="temp.person.address" clearable placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" clearable placeholder="请输入Email" />
        </el-form-item>
        <el-form-item label="手机号" prop="person.telephone">
          <el-input v-model="temp.person.telephone" clearable placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="个人简介" prop="person.introduction">
          <el-input v-model="temp.person.introduction" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
import { fetchUserList, fetchStandardSexItem, fetchStandardStatusItem, createUser, updateUser, deleteUser } from '@/api/users'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'UsersTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value.length < 3 || value.length >= 64) {
        callback(new Error('密码长度大于3，小于64'))
      } else {
        callback()
      }
    }
    var reValidatePass = (rule, value, callback) => {
      if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 20,
        status: undefined,
        search: undefined,
        sex: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      standardSexOptions: null,
      standardStatusOption: null,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        password: '',
        repassword: '',
        sex: {
          id: '',
          name: ''
        },
        person: {
          name: '',
          address: '',
          telephone: '',
          introduction: ''
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      accountStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        name: [
          { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: ['change', 'blur'] },
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: ['blur', 'change'] },
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        repassword: [
          { validator: reValidatePass, trigger: ['blur', 'change'] },
          { required: true, message: '请再次输入密码', trigger: 'blur' }
        ],
        person: {
          name: [
            { required: true, message: '请再次输入密码', trigger: 'blur' }
          ]
        },
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      downloadLoading: false,
      create: true,
      imageUrl: ''
    }
  },
  created() {
    this.getList()
    this.getStandardSex()
    this.getStandardStatus()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getStandardSex() {
      fetchStandardSexItem().then(response => {
        this.standardSexOptions = response.data
      })
    },
    getStandardStatus() {
      fetchStandardStatusItem().then(response => {
        this.standardStatusOption = response.data
      })
    },
    handleFilter() {
      this.listQuery.offset = 1
      this.getList()
    },
    handleModifyStatus(row, statusId, statusName) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status.id = statusId
      row.status.name = statusName
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        password: '',
        repassword: '',
        sex: {
          id: undefined,
          name: ''
        },
        person: {
          id: undefined,
          name: '',
          address: '',
          telephone: '',
          introduction: ''
        }
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log('xxxx')
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          createUser(this.temp).then((response) => {
            console.log(response.data)
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.temp, this.temp.id).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteUser(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
