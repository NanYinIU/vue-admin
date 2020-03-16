<template>
  <el-container>
    <el-container style=" border: 1px solid #eee">
      <el-aside style="background-color: rgb(238, 241, 246)">
        <el-tree default-expand-all draggable :expand-on-click-node="false" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main style="margin-top:5px">
        <div class="filter-container">
          <el-input v-model="listQuery.search" placeholder="搜索Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加子单位
          </el-button>
        </div>
        <el-table
          :key="tableKey"
          row-key="id"
          v-loading="listLoading"
          :data="list"
          :tree-props="{children: 'children', hasChildren: 'children.length>0'}"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >

          <el-table-column label="名称" prop="name" align="center" width="200">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="单位编号" prop="code" align="center" width="300">
            <template slot-scope="{row}">
              <span>{{ row.code }}</span>
            </template>
          </el-table-column>

          <el-table-column label="单位地址" prop="address" align="center" width="380">
            <template slot-scope="{row}">
              <span>{{ row.address }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.offset" :limit.sync="listQuery.limit" @pagination="getList" />
      </el-main>
    </el-container>
  </el-container>

</template>

<style>
  .el-aside {
    color: #333;
  }
</style>

<script>
import { fetchUnits, fetchUnitList } from '@/api/units'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        search: undefined,
        sort: '+id',
        unit: ''
      }
    }
  },
  created() {
    this.getUnits()
    this.getList()
  },
  methods: {
    getUnits() {
      fetchUnits().then((response) => {
        const root = [{
          id: 0,
          name: '所有单位',
          children: response.data
        }]
        this.data = root
      })
    },
    getList() {
      fetchUnitList(this.listQuery).then((response) => {
        this.list = response.data.content
        this.total = response.data.totalElements
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.offset = 1
      this.getList()
    },
    handleCreate() {
      console.log()
    },
    handleNodeClick(data) {
      if (data.id === 0) {
        this.listQuery.unit = null
      } else {
        this.listQuery.unit = data.id
      }
      this.getList()
    }
  }
}
</script>
