<template>
  <div>
    <el-tabs v-model="activeName" tab-position="left" style="margin-top:30px" @tab-click="handleClick">
      <el-tab-pane
        v-for="{id,name,comment} in roles"
        :key="id"
        :label="name"
        :name="''+id"
      >
        <el-row style="margin-bottom: 20px;">
          <el-alert
            type="info"
            effect="dark">
            <i class="el-icon-info"></i> {{ comment }}
          </el-alert>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="13">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>角色人员设置</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleCreate">为角色添加人员</el-button>
              </div>

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
                </div>
                <el-table
                  :key="tableKey"
                  v-loading="listLoading"
                  :data="list"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;"
                >
                  <el-table-column label="用户名" prop="username" align="center" width="160">
                    <template slot-scope="{row}">
                      <span>{{ row.name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="姓名" prop="person.name" align="center" width="160">
                    <template slot-scope="{row}">
                      <span>{{ row.person.name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="性别" prop="sex" align="center" width="80">
                    <template slot-scope="{row}">
                      <span>{{ row.sex.name }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="账户状态" class-name="status-col" width="80">
                    <template slot-scope="{row}">
                      <el-tag :type="row.status.id | statusFilter">
                        {{ row.status.name }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination v-show="total>0" :total="total" :page.sync="listQuery.offset" :limit.sync="listQuery.limit" @pagination="getUsers" />
              </div>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>角色权限设置</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handlePermissionCreate">为角色添加权限</el-button>
              </div>
              <el-table
                :key="authTableKey"
                v-loading="authListLoading"
                :data="authList"
                border
                fit
                highlight-current-row
                style="width: 100%;"
              >
                <el-table-column label="权限名" prop="username" align="center" width="160">
                  <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="权限备注" prop="comment" align="center" width="300">
                  <template slot-scope="{row}">
                    <span>{{ row.comment }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="total>0" :total="authTotal" :page.sync="authListQuery.offset" :limit.sync="authListQuery.limit" @pagination="getPermissions" />
            </el-card>

          </el-col>
        </el-row>

      </el-tab-pane>
    </el-tabs>

    <el-dialog title="添加/取消人员角色" :visible.sync="dialogFormVisible">
      <el-transfer
        v-model="userValue"
        filterable
        filter-placeholder="请输入名称"
        :titles="['人员表', '角色人员']"
        :button-texts="['取消', '添加']"
        :data="listData"
        @change="handleAuthTransferChange"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加/取消权限" :visible.sync="authDialogFormVisible">
      <el-transfer
        v-model="authValue"
        filterable
        filter-placeholder="请输入名称"
        :titles="['权限表', '角色权限']"
        :button-texts="['取消', '添加']"
        :data="authListData"
        @change="handleAuthTransferChange"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authDialogFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

import { fetchRoleList, fetchRoleUsers, updateRoleUser, fetchRolePermissions, updateRolePermissions } from '@/api/roles'
import { fetchUserList, fetchStandardSexItem, fetchStandardStatusItem } from '@/api/users'
import { fetchPermissionList } from '@/api/permission'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
export default {
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
    return {
      activeName: '',
      dialogFormVisible: false,
      tableKey: 0,
      roles: {
        id: 1,
        name: 0
      },
      tabPosition: 'left',
      listQuery: {
        status: undefined,
        search: undefined,
        sex: undefined,
        sort: '+id',
        role: '',
        offset: 1,
        limit: 10
      },
      list: null,
      total: 0,
      listLoading: true,
      listData: [],
      userValue: [],
      standardSexOptions: null,
      standardStatusOption: null,
      roleQuery: {
        role: ''
      },
      transferQuery: {
        standardKey: '',
        value: [],
        movedKeys: [],
        direction: ''
      },
      authTableKey: 0,
      authListQuery: {
        sort: '+id',
        role: '',
        offset: 1,
        limit: 10
      },
      authList: null,
      authTotal: 0,
      authListLoading: true,
      authListData: [],
      authValue: [],
      authDialogFormVisible: false,
      authTransferQuery: {
        standardKey: '',
        value: [],
        movedKeys: [],
        direction: ''
      }
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    getRoles() {
      fetchRoleList().then(response => {
        this.roles = response.data.content
        this.listQuery.role = response.data.content[0].id
        this.authListQuery.role = response.data.content[0].id
        this.activeName = response.data.content[0].id + ''
      }).then(() => {
        this.getStandardSex()
        this.getStandardStatus()
        this.getUsers()
        this.getPermissions()
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
    getUsers() {
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getPermissions() {
      fetchPermissionList(this.authListQuery).then(response => {
        this.authList = response.data.content
        this.authTotal = response.data.totalElements
        setTimeout(() => {
          this.authListLoading = false
        }, 1.5 * 1000)
      })
    },
    handleClick(tab) {
      this.listQuery.role = tab.name
      this.authListQuery.role = tab.name
      this.roleId = tab.name
      this.getUsers()
      this.getPermissions()
    },
    handleFilter() {
      this.listQuery.offset = 1
      this.getUsers()
    },
    handleCreate() {
      this.listData = []
      this.userValue = []
      this.dialogFormVisible = true
      this.roleQuery.role = this.authListQuery.role
      fetchRoleUsers(this.roleQuery).then(response => {
        // this.list = response.data.content
        response.data.otr.forEach(item => {
          this.listData.push({
            label: item.name,
            key: item.id
          })
        })
        response.data.cur.forEach(item => {
          this.userValue.push(item.id)
          console.log(item.id)
        })
        console.log(this.listData)
        console.log(this.userValue)
      })
    },
    handleTransferChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      this.transferQuery.value = value
      this.transferQuery.direction = direction
      this.transferQuery.standardKey = this.listQuery.role
      this.transferQuery.movedKeys = movedKeys
      console.log(this.transferQuery)
      updateRoleUser(this.transferQuery).then(response => {
        this.getUsers()
      })
    },
    handlePermissionCreate() {
      this.authListData = []
      this.authValue = []
      this.authDialogFormVisible = true
      this.roleQuery.role = this.authListQuery.role
      fetchRolePermissions(this.authListQuery).then(response => {
        // this.list = response.data.content
        response.data.otr.forEach(item => {
          this.authListData.push({
            label: item.name,
            key: item.id
          })
        })
        response.data.cur.forEach(item => {
          this.authValue.push(item.id)
        })
        console.log(this.authListData)
        console.log(this.authValue)
      })
    },
    handleAuthTransferChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      this.authTransferQuery.value = value
      this.authTransferQuery.direction = direction
      this.authTransferQuery.standardKey = this.listQuery.role
      this.authTransferQuery.movedKeys = movedKeys
      console.log(this.authTransferQuery)
      updateRolePermissions(this.authTransferQuery).then(response => {
        this.getPermissions()
      })
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
