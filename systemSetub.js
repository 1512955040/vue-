require("../CSS/normalize.css")
require("../CSS/systemSetub.css")
var num=1;
var page=new Vue({
			el:"#page",
			data(){
				//类别名称
				var validatePass = (rule, value, callback) => {
					if(value === '') {
						callback(new Error('类别名称不能为空'));
						this.zIndex=false
						this.holder='请输入类别名称(名称)'
					} else {
						this.zIndex=true
						callback()
					}
				}
				return{
				//主菜单的4个按钮
					titleIndex:[
						{'index':'0'},
						{'index':'1'},
						{'index':'2'},
						{'index':'3'}
					],
					changeTitles:3,
					datas:[],
					arr:[],
					indexDelete:0,
					click_color:false,
					holder:"请输入类别名称(名称)",
					zIndex:false,
					Valength:0,
					 //删除
			        visible2:false,
			        loading:false,
			        dialogVisible1:false,
			        Detail_Deleting:'删 除',
		 			disabled:true,//是否删除按钮可点击
					checked:false,//删除复选框
					//分类表单提交
			        rules3: {
						name:[
							{validator: validatePass}
						]
					},
					//目录表单
					form:{
						name:'',
						describes:''
					},
				}
			},
			mounted(){
				setTimeout(()=>{
					this.handleHeight()
				})
			},
			created(){
				//查询左侧内容
				this.PageLeft()
				
			},
			methods: {
				//重置表单方法
			    resetForm(formName) {
        			this.$refs[formName].resetFields();
      			},
				//跳转页面方法
				changeTitle(index){
					this.changeTitles=index
					if(index===0){
						window.location.href="InquireHome.html"
					}else if(index===1){
						window.location.href="customerManagement.html"
					}else if(index===2){
						window.location.href="https://www.baidu.com"
					}else if(index===3){
						window.location.href="systemSetub.html"
					}
				},
				//左侧导航条动态高度
				handleHeight(){
					let RightNavMenu=document.getElementsByClassName("proplow")[0];
					let	ConentPageLeft=document.getElementById("ConentPageLeft")
					ConentPageLeft.style.height=RightNavMenu.offsetHeight+106+'px'
				},
			    handleOpen(key, keyPath) {
					setTimeout(()=>{
						this.handleHeight()
					},350)
			    },
			    handleClose(key, keyPath){
					setTimeout(()=>{
						this.handleHeight()
					},350)
			  	},
				//点击切换不同的工单列表
				handleSelect(index,indexPath){
					
				},
				//类别名称(必填)
			    validatePass0(){
					this.zIndex=true;this.holder=""
			    },
			  	//提示成功彈窗
				open6(code){
					this.$message({
          				showClose: true,
          				message: code,
          				type: 'success'
        			});
				},
			  	//警示弹窗
				open7(code) {
			         this.$confirm(code, '提示', {
          				dangerouslyUseHTMLString: false,
          				type: 'warning',
          				center: true
        			})
        			.then(() => {
				        this.$message({
				            type: 'success',
				        });
				    })
        			.catch(() => {
				        this.$message({
				            type: 'info',
				        });          
				    });
			 },
			 //查询左侧分类目录
			 PageLeft(){
			 	var _url="/productTypes";
			 	var data={}
			 	myGetByJson(_url,data).then(res=>{
					if(res.data.code==200){
						this.arr = []
//						console.log(res.data.data)
						if(res.data.data!=null && res.data.data.length>0){
							this.datas=res.data.data
							for(var i=0;i<this.datas.length;i++){
								if(res.data.data.length>=1){
									if(this.datas[i].name.length > 4){
										if(this.datas[i].name.substring(0,4)=="新建分类"){
											var sub = Number(this.datas[i].name.substring(4,))
											if(typeof(sub)==='number' && !isNaN(sub)){
												this.arr.push(Number(sub))
											}
										}
									}	
								}
							}
						}	
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			 //查询右侧目录 
			 PageRight(){
			 	var _url="/findProductType";
			 	var data={productTypeId:this.indexDelete}
			 	myGetByJson(_url,data).then(res=>{
			 		console.log(res)
			 		if(res.data.code==200){
			 			this.form.name=res.data.data.name
			 			this.form.describes=res.data.data.describes
			 		}else{
			 			this.open7(res.data.msg)
			 		}
			 	})
			 },
			  //添加分类
			  addmeau(){
			  		var num=1
					var j;
					this.arr=this.arr.sort((a,b)=>{
						if(a>b){
							return 1
						}else if(a<b){
							return -1
						}else{
							return 0
						}
					})
					console.log(this.arr)
					for(var i =0;i<this.arr.length;i++){
						j = this.arr[i]
						if(num == j){
						  	num++;
						}else{
						  	break;
						}
					}
					const newChild={
						"sid":num,
						"name":'新建分类'
					}
			  		var _url="/addProductTypes"
			  		var data={name:newChild.name+newChild.sid}
			  		myPostByJson(_url,data).then(res=>{
						if(res.data.code==200){
			  				this.PageLeft()
			  				this.datas=this.datas
							this.open6(res.data.data)
							setTimeout(()=>{
								this.form.name=newChild.name+newChild.sid
			  					this.indexDelete=this.datas[this.datas.length-1].id
			  					this.click_color=true
							},100)
						}else{
							this.open7(res.data.msg)
						}
					})
				    .catch(err=>{
						console.log(err)
					})
			  	},
			  	//选中子项
			  click_label(index,index1){
			  	  this.indexDelete=index
			  	  this.form.name=index1
			  	  this.click_color=true
			  	  this.PageRight()
			  },
			  //点击删除按钮
			  delete_this(){
			  	this.dialogVisible1=true
			  	this.Detail_Deleting='删除'
			  	this.checked=false
			  	this.disabled=true
			  },
			  //判断是否能删除
		 		Delete_this(e){
		 			let checked=e.target.checked;
		 			this.checked=e.target.checked;
		 			if(checked) {
		 				this.disabled=false
		 			}
		 			else{
		 				this.disabled=true
		 			}
		 		},
			  //删除
			  deletes(){
			  	var _url="/delProductTypes";
			 	var data={productTypeId:this.indexDelete}
			 	myGetByJson(_url,data).then(res=>{
			 		this.loading=!this.loading
					if(res.data.code==200){
						this.loading=false
						this.Detail_Deleting='删除成功'
						this.visible2=false
						this.dialogVisible1=false
						this.open6(res.data.data)
						this.PageLeft()
						setTimeout(()=>{
							var leng=this.datas.length
							this.indexDelete=this.datas[leng-1].id
							this.form.name=this.datas[leng-1].name
							this.click_color=true
						},100)
					}else{
						this.open7(res.data.msg)
					}
				})
				.catch(err=>{
					console.log(err)
				})
			  },
			  //编辑提交表单
			   onSubmit(formName) {
			        this.$refs[formName].validate((valid) => {
			        if (valid) {
			        	var _url="/updateProductTypes/"+this.indexDelete
			        	var data={name:this.form.name,describes:this.form.describes,id:this.indexDelete}
			          	myPostByJson(_url,data).then(res=>{
							if(res.data.code==200){
								this.PageLeft()
								this.open6(res.data.data)
							}else{
								this.open7(res.data.msg)
							}
						})
				        .catch(err=>{
							console.log(err)
						})     	
			        }else{
			            console.log('error submit!!');
			            return false;
			        }
			      });
			    },
    		}	
		})
