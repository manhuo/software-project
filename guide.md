# Guide: Web Assembly 初见

## Instruction!!

本指引包含针对不同编程语言及工具链选择的 WebAssembly 指引，请根据你的选择阅读接下来的部分。

**极限编程场景需要大家迅速根据开发人员的具体情况，迅速选择解决方案。**

**请大家快速浏览 Guide，评估本结对的技术能力、技能点等客观条件，选择合适的编程语言技术栈。**

本指引包含一些思考题，虽然无需把回答写在哪儿，但希望大家尽量找到答案，有利于后续的结对项目进行。

**本 Guide 相关代码已位于代码仓库 `/G` 内。**

### 在开始之前：运行环境配置

本项目全程需要 Node.js 运行时支持，请首先确保计算机上安装了 **Node.js 的当前 LTS (now at v22.14.0) 版本。**

请自行解决安装，如果机器上已经安装了旧版本或更新版本的运行环境，请安装要求的版本并切换到该版本：对于这种需要管理多个 Node.js 版本的情况，推荐大家搜寻并使用 [nvm](https://github.com/nvm-sh/nvm)，也有 [Windows 版本](https://github.com/coreybutler/nvm-windows) 喔。

### AssemblyScript

[AssemblyScript](https://www.assemblyscript.org/) （以下略称 AS）是一种采用与 JavaScript/TypeScript 相近语法设计，但引入 WebAssembly 类型的编程语言。如果你熟悉 JS/TS 开发，应该会感到非常好上手！顺带一提请放轻松——本项目设计的任务并不会需要对高级语言特性有了解，因此即便你从未接触过 JS/TS（真的一点也没写过吗！），应当也不会因为选择 AssemblyScript 完成结对任务而遇到根本做不来的障碍。

AS 通过引入与 Wasm 充分对接的类型系统、并对语法特性进行合理的限缩和调整，实现静态化和 AOT 编译。

> **→ 📖 [思考题 A1] AssemblyScript 与 JavaScript/TypeScript 有什么不同？**

接下来，会介绍如何使用 AS 完成本任务的项目开发。

首先，请创建目录 `g-as` 并切换到该目录：

```bash
mkdir g-as
cd g-as
```

执行项目的初始化：

```bash
npm init
npm install --save-dev assemblyscript
npx asinit .
```

在目录 `/assembly` 中，你可以找到已初始化的、包含一个默认的导出函数 `add()` 的 Wasm 模块入口 `index.ts`；你可以自由修改以完成你的代码实现。

当你编写完成代码后，可以通过以下命令来执行编译：

```bash
npm run asbuild
```

> **→ 📖 [思考题 A2] 执行 `npm run asbuild` 后，发生了什么？**

你可以在 `/tests/index.js` 中编写测试，并通过以下命令来执行测试：

```bash
npm test
```

你可以参照[官方文档](https://www.assemblyscript.org/getting-started.html#setting-up-a-new-project)来了解更多。

### Rust

[Rust](https://www.rust-lang.org/) 是注重性能、可靠性与生产力的编程语言🦀。作为一个诞生于 Mozilla，把“赋能（Empowerment）”当作自己关键词的新兴（算是比较新啦！）编程语言，Rust 对互联网领域应用也相当关注，部分体现在从基础设施层面对 WebAssembly 工具链的广泛适配和支持上。

既然你选择 Rust，想必你应该已经接触过这门语言了——即便没有接触过，这也是一门由于许多语言层面的优良设计而易上手、易使用的语言！使用 Rust 完成接下来的任务最直接的好处是能够得益于其带来的性能优势。顺带一提请放轻松——本项目设计的任务并不会需要对高级语言特性有了解，因此即便你从未接触过 Rust（这个可能还蛮经常的啦），应当也不会因为选择 Rust 完成结对任务而遇到无法逾越的障碍。

如果你从未接触过 Rust，一个比较好的起点是 [Rust 程序设计语言（"the book"）](https://doc.rust-lang.org/book/)，另有非官方的[中文版 1](https://kaisery.github.io/trpl-zh-cn/)，[中文版 2](https://rustwiki.org/zh-CN/book/)可供阅读。大概读到第三章就差不多了！虽然上手编程语言的方法可能更多地依靠“做中学”——

接下来，会介绍如何使用 Rust 完成本任务的项目开发。

首先，请切换至目录 `g_rust`：

```bash
cd g_rust
```

你会发现这里已经存在一些代码，代码框架是通过以下这些命令来生成的：

```bash
cargo new --lib g_rust
cd g_rust
cargo add wasm-bindgen
```

还进行了一些手工的改动，包括：

- 在 `Cargo.toml` 中增加了：

  ```toml
  [lib]
  crate-type = ["cdylib", "rlib"]
  ```

- 在 `lib.rs` 中编写了代码。

你可以参考 [Rust&Wasm 文档](https://rustwasm.github.io/docs/book/introduction.html) 以及 [wasm-pack 文档](https://rustwasm.github.io/docs/wasm-pack/introduction.html) 和 [wasm-bindgen 文档](https://rustwasm.github.io/wasm-bindgen/) 来了解更多内容。

当你编写完成代码后，请参照官方指引[安装并配置 `wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/)，随后通过以下命令来执行编译和打包现有项目为 Node.js 模块的操作：

```bash
wasm-pack build --target nodejs
```

> **→ 📖 [思考题 R1] 浏览 `Cargo.toml`，请问第 9 行的设置项中： `crate-type="cdylib"` 的作用是？可以从上述文档当中寻找答案。**

> **→ 📖 [思考题 R2] 浏览 `lib.rs`，请问第 3 行的属性（Attribute）注解`#[wasm_bindgen]` 的作用是？请尝试删除掉这一注解重新运行上面这条 `wasm-pack` 的编译和打包指令，检查删除前后 `/pkg` 内生成的文件发生的变化；并请参考上述文档完善答案。**

你可以在 `/src/lib.rs` 中编写测试，并通过以下命令来执行测试：

```bash
cargo test
```

### C/C++

**请谨慎选择 C/C++ 作为实现语言，虽然它可能有更熟悉、性能也许在某些情形下略有收益等可能的好处，但也有更需要对相关工具链有较为深入的理解这样的技术要求。**

有的同学可能对 AS 或者 Rust 都不熟悉，所以希望使用 C/C++ 语言完成本次结对编程。不过丑话说在前面，C/C++ 对 Wasm 的支持并不完美（开箱即用），选择 C/C++，意味着你必须静下心来慢慢捣鼓环境，并借由各种技术资料深度理解 C/C++ 和 Wasm 的交互方式。

本篇教程主要参考了 [Wasm官方文档](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/C_to_Wasm)，感兴趣的同学也可以去阅读原文。

接下来，会介绍如何使用 C/C++ 完成后续的项目开发。需要特别注意的是，本篇教程默认在 Ubuntu22.04 环境下开发，且默认使用 C 语言（而非 C++），使用Windows，MacOS，或其他Linux发行版的同学，请注意你需要使用的命令可能会有所不同。

在开始之前，请先确保你的电脑已安装 Python3.6 以上版本，且能够正确编译普通的 C 代码（使用 gcc/clang/msvc）。

首先需要安装 C 到 Wasm 的编译器 [emscripten](https://emscripten.org/)。这一部分同学们也可以直接参考 [emscripten官网教程](https://emscripten.org/docs/getting_started/downloads.html)。

1. 找一个合适的目录 clone 或直接下载 emsdk：https://github.com/emscripten-core/emsdk

   > 使用 `git clone https://github.com/emscripten-core/emsdk.git` 或下载 zip 后解压

2. 进入 emsdk 目录，并运行脚本获取最新工具链：

   >```bash
   ># 进入emsdk目录
   >cd emsdk
   ># 下载最新工具链
   >./emsdk install latest
   ># 激活最新工具链
   >./emsdk activate latest
   ># 将工具链添加到PATH
   >source ./emsdk_env.sh
   >```
   >
   >注意：对 Windows 用户来说，请使用 `emsdk.bat` 和 `emsdk_env.bat`

3. 验证安装无误

   > 键入 `emcc --version` 命令，若正确展示了 emcc 的版本则说明安装正确无误。

注意：第二步激活的工具链环境只在当前 shell 中有效，如果需要保持长期有效，可以考虑将 `source ./emsdk_env.sh` 添加到对应 shell 的登录环境配置中（如 `.bashrc`）

现在可以正式开始写代码了！

新建并切换至一个目录 `g_c`，并新建一个 C 源文件（如 `main.c`），在其中完成你的函数 `func` 的实现。

接着使用以下指令编译你的C程序：

```bash
emcc main.c -O3 -o module.cjs \
  -s EXPORTED_FUNCTIONS='["_func"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -s WASM=1 -s MODULARIZE=1
```

> 解释：
>
> `main.c` 应为你的C源程序名字
>
> `-O3` 开启非常重视性能的编译优化
>
> `module.cjs` 为生成的 `cjs` 文件路径
>
> `EXPORTED_FUNCTIONS` 则表明了哪些函数可以在 Wasm 中调用（注意**函数名称前有个下划线**）
>
> `EXPORTED_RUNTIME_METHODS` 则表明了要使用哪些胶水函数，这里我们使用 `cwrap` 比自己编写胶水代码方便
>
> `WASM=1` 则表示了要生成 `wasm`（和前文指定的 `cjs` 文件路径和名字相同，只是改了个后缀）
>
> `MODULARIZE=1` 表示要生成 ESModule 类型的胶水代码

随后新建文件 `bridge.js` 作为调用 Wasm 的桥梁，内容如下：

```js
// 从编译生成的 cjs 文件中导入 Wasm Module
import Module from './module.cjs'

// 考虑到真实网页场景，通过网络加载 wasm 可能很慢，所以 Module 是一个异步函数，
// 而我们是本地的环境，这里直接 await 就好
const wasm = await Module();
// 使用 cwrap 函数方便的包装 C 中的函数
// 使用方法：cwrap(函数名, 返回值类型, 参数列表)
const c_func = wasm.cwrap('func', 'number', ['number', 'array', 'number']);

// 测试时真正调用的方法
export const func = (flag, seq, size) => {
    // 由于 seq 这样的 js数组 没有对应的C语言类型，
    // 而C语言的数组入参均表现为指针，所以需要包装一下
    let array = new Uint8Array((new Int32Array(seq)).buffer);
    return c_func(flag, array, size);
};
```

你可以采用你熟悉的方法来实现单元测试。

> → 📖 [思考题 C1] 上述 `bridge.js` 代码中，为什么要把 seq 包装两层再传递给 Wasm？如果不包装（直接调用 `c_func(flag, array, size)` 会有什么效果？如果只包装一层（即 `c_func(flag, new Int32Array(seq), size)`）会有什么效果？如果直接包装 Uint8Array （即 `c_func(flag, new Uint8Array(seq), size)`）又会有什么效果？将 `Uint8Array` 改为 `Int8Array` 会有什么区别吗？尝试探究将 JS 数组转化到 C 指针的原理。

最后，对于打算使用C++作为编程语言的同学，还需要额外探究一些内容：

> → 📖 [思考题 C2] （如果不使用 C++ 则可以忽略此问题）直接将 C 源文件后缀改为 cpp 能顺利通过编译吗？如果不能，如何改动才能通过编译呢？

如果对于两个思考题完全没有头绪，或许可以搜寻关于 **Wasm 虚拟机内存模型**、**C/C++ to Wasm 后端实现** 的技术文章。

如果实在无法理解相关信息，想必后面的实现会比较难，回头是岸喔——！

> By @KumaXX (AS, rust) and @TobyShi (C/C++)