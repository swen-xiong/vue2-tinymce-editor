// import axios from 'axios'
// import { getOssPolicy } from '@/api/tools/oss'

// /**
//  * 智能构建 OSS 上传 URL，避免重复添加协议前缀
//  * @param {string} host - OSS host 地址
//  * @returns {string} 完整的 OSS 上传 URL
//  */
// function buildOssUrl(host) {
//   if (!host) return ''
//   // 如果已经包含协议，直接返回
//   if (host.startsWith('http://') || host.startsWith('https://')) {
//     return host
//   }
//   // 否则添加 https 协议
//   return `https://${host}`
// }

// /**
//  * 生成唯一的文件名
//  * @param {File} file - 文件对象
//  * @returns {string} 生成的文件名
//  */
// function generateFilename(file) {
//   if (file instanceof Blob) {
//     return +new Date() + '' + parseInt(Math.random() * 100)
//   }
//   const ext = file.name.match(/.\w+$/)?.[0] || ''
//   return +new Date() + '' + parseInt(Math.random() * 100) + ext
// }

// /**
//  * 构建 OSS 上传表单数据
//  * @param {File} file - 文件对象
//  * @param {Object} ossData - OSS 配置数据
//  * @returns {Object} 包含 formData 和 key 的对象
//  */
// function buildOssFormData(file, ossData) {
//   const filename = generateFilename(file)
//   const key = ossData.path + '' + filename
//   const urlPrefix = buildOssUrl(ossData.host)

//   const form = new FormData()
//   form.append('key', key)
//   form.append('policy', ossData.policy)
//   form.append('Signature', ossData.signature)
//   form.append('OSSAccessKeyId', ossData.accessId)
//   form.append('file', file)

//   return { form, key, urlPrefix }
// }

// /**
//  * 执行 OSS 文件上传
//  * @param {File} file - 文件对象
//  * @param {Object} ossData - OSS 配置数据
//  * @returns {Promise<string>} 上传成功后的文件 URL
//  */
// async function uploadToOss(file, ossData) {
//   const { form, key, urlPrefix } = buildOssFormData(file, ossData)
//   await axios.post(urlPrefix, form)
//   return urlPrefix + '/' + key
// }
// export const imagesUploadHandler = (blobInfo, _progress) =>
//   new Promise((resolve, reject) => {
//     getOssPolicy()
//       .then(async data => {
//         console.log('🚀 ~ imagesUploadHandler ~ data:', data)
//         const file = blobInfo.blob() // 转化为易于理解的File对象
//         // if (!(file instanceof File)) throw new TypeError('file参数应当是一个文件类型')

//         try {
//           const url = await uploadToOss(file, data)
//           console.log(url)
//           resolve(url)
//         } catch (error) {
//           console.error('图片上传失败:', error)
//           reject('uploader error')
//         }
//       })
//       .catch(e => {
//         console.error('获取 OSS 配置失败:', e)
//         reject('uploader error')
//       })
//   })

// export const fileUploaderHandler = (callback, value, meta) => {
//   if (meta.filetype === 'media' || meta.filetype === 'image') {
//     const input = document.createElement('input') // 创建一个隐藏的input
//     input.setAttribute('type', 'file')
//     input.onchange = function () {
//       const file = this.files[0] // 选取第一个文件

//       getOssPolicy()
//         .then(async data => {
//           console.log('文件上传 OSS 数据:', data)

//           try {
//             const url = await uploadToOss(file, data)

//             // 根据文件类型处理 URL
//             const processedUrl = url.replace(/image\.studio/g, 'static.studio')

//             if (meta.filetype === 'image') {
//               callback(processedUrl, { width: '100%', height: '' })
//             } else {
//               callback(processedUrl)
//             }
//           } catch (error) {
//             console.error('文件上传失败:', error)
//             // 可以在这里添加用户友好的错误提示
//           }
//         })
//         .catch(error => {
//           console.error('获取 OSS 配置失败:', error)
//         })
//     }
//     // 触发点击
//     input.click()
//   }
// }
