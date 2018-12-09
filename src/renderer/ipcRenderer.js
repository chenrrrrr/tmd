var { ipcRenderer, remote } = require('electron');
var fs = require('fs');

// dom
var srcDom = document.querySelector("#src");
var buildDom = document.querySelector("#build");
var tipsDom = document.querySelector("#tips");
var screenDom = document.querySelector("#screen");

// 定时器缓存
var timerCache = null;
// 是否存盘
var diskPath = ''

// 监听主进程操作
ipcRenderer.on('action', (event, action) => {
  // 保存
  switch (action) {
    case 'save':
      // 如果没有存盘
      if ('' === diskPath) {
        // 弹出保存提示框，同步
        var savePath = remote.dialog.showSaveDialog({ defaultPath: '无标题文档.md' });
        if (savePath) {
          // 执行保存
          fs.writeFile(savePath, srcDom.value, function (err) {
            if (!err) {
              tip('已存档');
              diskPath = savePath;
              removeStarInTitle();
            } else {
              tip('发生了未知错误');
              console.log(err);
            }
          })
        }
      } else {
        fs.writeFile(diskPath, srcDom.value, function (err) {
          if (!err) {
            tip('已存档');
            removeStarInTitle();
          } else {
            tip('发生了未知错误');
            console.log(err);
          }
        })
      }
      break;
    case 'new':
      // 内容为空
      if (srcDom.value.length === 0) {
        doNewMdFlow();
      } else {
        // 没保存
        if (document.title.indexOf('*') > -1) {
          tip('当前文档未保存，请保存后再新建');
          return;
        } else {
          doNewMdFlow();
        }
      }
      break;
    case 'open':
      // 内容为空
      if (srcDom.value.length === 0) {
        var openPath = remote.dialog.showOpenDialog();
        if (openPath) {
          doOpenMdFlow(openPath);
        }
      } else {
        // 没保存
        if (document.title.indexOf('*') > -1) {
          tip('当前文档未保存，请保存后再打开');
          return;
        } else {
          var openPath = remote.dialog.showOpenDialog();
          if (openPath) {
            doOpenMdFlow(openPath);
          }
        }
      }
      break;
  }
});

/*
// 监听右键点击
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.send('contextMenu');
});
*/


// 监听srcDom内容改变
srcDom.addEventListener('input', function () {
  srcDom.value.length === 0 ? document.title = document.title.replace(/\*/g, '') : document.title = document.title.replace(/\*/g, '') + ' *';
  buildDom.scrollTop = buildDom.scrollHeight;
});

// 监听输入
srcDom.addEventListener('input', function (e) {
  buildDom.innerHTML = marked(srcDom.value);
  // 强制prism重新渲染
  Prism.highlightAll();
})

// 选择屏幕模式
screenDom.addEventListener('click', function (e) {
  if (e.target.innerHTML === '1|1') {
    e.target.innerHTML = '1|0';
    buildDom.style.display = 'none';
    srcDom.style.display = 'block';
    srcDom.style.width = '100%';
    tip('编辑');
  } else if (e.target.innerHTML === '1|0') {
    e.target.innerHTML = '0|1';
    srcDom.style.display = 'none';
    buildDom.style.display = 'block';
    buildDom.style.width = '100%';
    tip('预览');
  } else {
    e.target.innerHTML = '1|1';
    srcDom.style.display = 'block';
    buildDom.style.display = 'block';
    srcDom.style.width = '50%';
    buildDom.style.width = '50%';
    tip('编辑/预览');
  }
});

/**
 * 执行打开md文件的流程
 * @param {打开文件的路径} filepath
 */
function doOpenMdFlow (filepath) {
  // disPath render
  diskPath = filepath[0];
  // title render
  document.title = filepath[0];
  // srcDom render
  srcDom.value = fs.readFileSync(filepath[0], 'utf-8');
  // buildDom render
  buildDom.innerHTML = marked(srcDom.value);
  // prism rerender
  Prism.highlightAll();
}

/**
 * 执行新建的流程
 */
function doNewMdFlow () {
  // title render
  document.title = '无标题文档';
  // srcDom render
  srcDom.value = '';
  // buildDom render
  buildDom.innerHTML = '';
  // empty diskPath
  diskPath = '';
}


/**
 * 移除标题*号
 */
function removeStarInTitle () {
  document.title = document.title.replace(/\*/g, '')
}

/**
 * tipsDom添加提示
 * @param {提示内容} text
 */
function tip (text) {
  clearTimeout(timerCache);
  tipsDom.innerHTML = text;
  tipsDom.style.display = 'inline-block'
  timerCache = setTimeout(function () {
    tipsDom.innerHTML = '';
    tipsDom.style.display = 'none';
  }, 3000)
}
