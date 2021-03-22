declare module 'fonteditor-core' {

    /** 读取配置. */
    export interface FontReadOptions {
        
        /** 字体类型. */
        type?: 'ttf' | 'woff' | 'woff2' | 'eot' | 'svg'
    
        /** 是否保留 hinting 信息, 以使得文字更容易和像素对齐, 用于 ttf, woff , eot. */
        hinting?: boolean
    
        /**  复合字形转简单字形, 用于 ttf, woff, eot. */
        compound2simple?: boolean
    
        /** 解压相关函数, 用于 woff. */
        inflate?: boolean
    
        /** 是否合并成单个字形，仅限于普通 svg 导入. */
        combinePath?: boolean
    
        /** 只读取部分字符. */
        subset?: number[]
    }
    
    /** 写入配置. */
    export interface FontWriteOptions {
        
        /** 字体类型 */
        type: 'ttf' | 'woff' | 'woff2' | 'eot' | 'svg'
    
        /**  nodejs 环境中返回 Buffer 对象, 默认 true. */
        toBuffer?: boolean
    
        /** 是否保留 hinting 信息, 用于 ttf, woff, eot. */
        hinting?: boolean
    
        /** 字体相关的元数据信息, 用于 svg, woff. */
        metadata?: {[name: string]: string}
    
        /** 压缩相关函数, 用于 woff. 默认为 false. */
        deflate?: boolean
    
        /** 用于覆写字体的对应属性. */
        support?: {
            head: TTFObject['head']
            hhea: TTFObject['hhea']
        }
    }
    
    /** TTF 数据对象. */
    export interface TTFObject {
        version: 1
        numTables: 12
        searchRenge: 128
        entrySelector: 3
        rengeShift: 64
        head: {
            version: 1
            fontRevision: 1.004
            checkSumAdjustment: 251623041
            magickNumber: 1594834165
            flags: 11
            unitsPerEm: 1000
            created: string
            modified: string
            xMin: -536
            yMin: -350
            xMax: 1788
            yMax: 900
            macStyle: 0
            lowestRecPPEM: 8
            fontDirectionHint: 2
            indexToLocFormat: 0
            glyphDataFormat: 0
        }
        maxp: {
            version: 1
            numGlyphs: 252
            maxPoints: 146
            maxContours: 10
            maxCompositePoints: 0
            maxCompositeContours: 0
            maxZones: 2
            maxTwilightPoints: 0
            maxStorage: 1
            maxFunctionDefs: 1
            maxInstructionDefs: 0
            maxStackElements: 64
            maxSizeOfInstructions: 7
            maxComponentElements: 0
            maxComponentDepth: 0
        }
        cmap: {[unicodeNum: number]: number}
        glyf: Glyf[]
        name: {
            copyright: string
            fontFamily: string
            fontSubFamily: string
            uniqueSubFamily: string
            fullName: string
            version: string
            postScriptName: string
            tradeMark: string
            manufacturer: string
            designer: string
            urlOfFontDesigner: string
            licence: string
            urlOfLicence: string
            preferredFamily: string
            preferredSubFamily: string
        }
        hhea: {
            version: 1
            ascent: 900
            descent: -350
            lineGap: 0
            advanceWidthMax: 1788
            minLeftSideBearing: -535
            minRightSideBearing: -480
            xMaxExtent: 1788
            caretSlopeRise: 1
            caretSlopeRun: 0
            caretOffset: 0
            reserved0: 0
            reserved1: 0
            reserved2: 0
            reserved3: 0
            metricDataFormat: 0
            numOfLongHorMetrics: 252
        }
        post: {
            format: 2
            italicAngle: 0
            underlinePosition: -65
            underlineThickness: 10
            isFixedPitch: 0
            minMemType42: 0
            maxMemType42: 0
            minMemType1: 0
            maxMemType1: 252
        }
        'OS/2': {
            ulCodePageRange1: 1
            ulCodePageRange2: 0
            sxHeight: 237
            sCapHeight: 636
            usDefaultChar: 0
            usBreakChar: 32
            usMaxContext: 1
            version: 4
            xAvgCharWidth: 513
            usWeightClass: 400
            usWidthClass: 5
            fsType: 0
            ySubscriptXSize: 700
            ySubscriptYSize: 650
            ySubscriptXOffset: 0
            ySubscriptYOffset: 140
            ySuperscriptXSize: 700
            ySuperscriptYSize: 650
            ySuperscriptXOffset: 0
            ySuperscriptYOffset: 477
            yStrikeoutSize: 50
            yStrikeoutPosition: 250
            sFamilyClass: 0
            bFamilyType: 2
            bSerifStyle: 0
            bWeight: 5
            bProportion: 7
            bContrast: 6
            bStrokeVariation: 0
            bArmStyle: 0
            bLetterform: 2
            bMidline: 0
            bXHeight: 3
            ulUnicodeRange1: 2147483695
            ulUnicodeRange2: 268435456
            ulUnicodeRange3: 0
            ulUnicodeRange4: 0
            achVendID: string
            fsSelection: 64
            usFirstCharIndex: 32
            usLastCharIndex: 64258
            sTypoAscender: 900
            sTypoDescender: -350
            sTypoLineGap: 0
            usWinAscent: 900
            usWinDescent: 350
        }
        prep: number[]
        gasp: number[]
    }
    
    /** 查询条件. */
    export interface FontFindCondition {
    
        /** unicode编码列表或者单个unicode编码 */
        unicode?: number | number[] | string[]
    
        /** glyf名字，例如`uniE001`, `uniE` */
        name?: string
    
        /**  自定义过滤器. */
        filter?: (glyph: Glyf) => boolean
    }
    
    /** 字形对象. */
    export interface Glyf {
    
        /** 字符名称. */
        name: string
    
        /** 坐标范围的左侧. */
        xMin: number
    
        /** 坐标范围的上侧. */
        yMin: number
    
        /** 坐标范围的右侧. */
        xMax: number
    
        /** 坐标范围的下侧. */
        yMax: number
    
        /** 字形曲线的点集.. */
        contours: GlyfPoint[][]
    
        /** 指令集. */
        instructions?: number[]
    
        /** Unicode 编码. */
        unicode: number[]
    
        /** 布局时的宽度. */
        advanceWidth: number
    
        /** 布局时的左侧移动宽度. */
        leftSideBearing: number
    }
    
    /** 字形顶点位置. */
    export interface GlyfPoint {
        x: number
        y: number
        onCurve?: boolean
    }
    
    /** 合并字形选项. */
    export interface FontMergeOptions {
    
        /** 是否自动缩放 */
        scale?: boolean
    
        /** 是否调整字形以适应边界, 和 options.scale 参数互斥. */
        adjustGlyf?: boolean
    }
    
    /** 字形位置设置. */
    export interface GlyfPosSettings {
    
        /** 左边距 */
        leftSideBearing?: number
    
        /** 右边距 */
        rightSideBearing?: number
    
        /** 垂直对齐 */
        verticalAlign?: number
    }
    
    /** 字形属性设置. */
    export interface GlyfSettings {
    
        /** 字形反转操作 */
        reverse?: boolean
    
        /** 字形镜像操作 */
        mirror?: boolean
    
        /** 字形缩放 */
        scale?: number
    
        /** 是否调整字形到 em 框 */
        ajdustToEmBox?: boolean
    
        /** 调整到 em 框的留白 */
        ajdustToEmPadding?: number
    }
    
    /** 文字度量信息. */
    export interface FontMetrics {
        ascent: number
        descent: number
        sTypoAscender: number
        sTypoDescender: number
        usWinAscent: number
        usWinDescent: number
        sxHeight: number
        sCapHeight: number
    }
    
    
    export namespace Font {
    
        /**
         * 读取字体数据
         *
         * @param {ArrayBuffer|Buffer|string} buffer 字体数据
         * @param {Object} options  读取参数
         * @return {Font}
         */
        export function create(buffer: ArrayBuffer | Buffer | string | TTFObject, options: FontReadOptions): Font
    
        /**
         * base64序列化buffer 数据
         *
         * @param {ArrayBuffer|Buffer|string} buffer 字体数据
         * @return {string}
         */
        export function toBase64(buffer: ArrayBuffer | Buffer | string): string
    }
    
    export class Font {
    
        /** 字体类型 */
        type: 'ttf' | 'woff' | 'woff2' | 'eot' | 'svg'
    
        /**
         * 字体对象构造函数
         *
         * @param {ArrayBuffer|Buffer|string} buffer  字体数据
         * @param {Object} options  读取参数
         */
        constructor(buffer: ArrayBuffer | Buffer | string | TTFObject, options: FontReadOptions)
    
        /**
         * 读取字体数据
         *
         * @param {ArrayBuffer|Buffer|string} buffer  字体数据
         * @param {Object} options  读取参数
         * @param {string} options.type 字体类型
         *
         * ttf, woff , eot 读取配置
         * @param {boolean} options.hinting 保留hinting信息
         * @param {boolean} options.compound2simple 复合字形转简单字形
         *
         * woff 读取配置
         * @param {Object} options.inflate 解压相关函数
         *
         * svg 读取配置
         * @param {boolean} options.combinePath 是否合并成单个字形，仅限于普通svg导入
         * @return {this}
         */
        read(buffer: ArrayBuffer | Buffer | string, options: FontReadOptions): this
    
        /**
         * 写入字体数据
         *
         * @param {Object} options  写入参数
         * @param {string} options.type   字体类型, 默认 ttf
         * @param {boolean} options.toBuffer nodejs 环境中返回 Buffer 对象, 默认 true
         *
         * ttf 字体参数
         * @param {boolean} options.hinting 保留hinting信息
         *
         * svg,woff 字体参数
         * @param {Object} options.metadata 字体相关的信息
         *
         * woff 字体参数
         * @param {Object} options.deflate 压缩相关函数
         * @return {Buffer|ArrayBuffer|string}
         */
        write(options?: FontWriteOptions): Buffer | ArrayBuffer | string
    
        /**
         * base64序列化buffer 数据
         *
         * @param {ArrayBuffer|Buffer|string} buffer 字体数据
         * @return {string}
         */
        toBase64(options?: FontWriteOptions): string
    
        /**
         * 获取 font 数据
         *
         * @return {Object} ttfObject 对象
         */
        get(): TTFObject
    
        /**
         * 设置 font 对象
         *
         * @param {Object} data font的ttfObject对象
         * @return {this}
         */
        set(data: TTFObject): this
    
        /**
         * 对字形数据进行优化
         *
         * @param  {Object} out  输出结果
         * @param  {boolean|Object} out.result `true` 或者有问题的地方
         * @return {this}
         */
        optimize(): this
    
         /**
         * 将字体中的复合字形转为简单字形
         *
         * @return {this}
         */
        compound2simple(): this
    
         /**
         * 对字形按照unicode编码排序
         *
         * @return {this}
         */
        sort(): this
    
         /**
         * 查找相关字形
         *
         * @param  {Object} condition 查询条件
         * @param  {Array|number} condition.unicode unicode编码列表或者单个unicode编码
         * @param  {string} condition.name glyf名字，例如`uniE001`, `uniE`
         * @param  {Function} condition.filter 自定义过滤器
         * @example
         *     condition.filter(glyf) {
         *         return glyf.name === 'logo';
         *     }
         * @return {Array}  glyf字形列表
         */
        find(condition: FontFindCondition): Glyf[]
    
        /**
         * 合并 font 到当前的 font
         *
         * @param {Object} font Font 对象
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
         *                                     (和 options.scale 参数互斥)
         *
         * @return {this}
         */
        merge(font: Font, options: FontMergeOptions): this
    }
    
    
    
    export class TTF {
    
        /**
         * ttf读取函数
         *
         * @constructor
         * @param {Object} ttf ttf文件结构
         */
        constructor(ttfObject: TTFObject)
    
        /**
         * 获取所有的字符信息
         *
         * @return {Object} 字符信息
         */
        codes(): string[]
    
        /**
         * 根据编码获取字形索引
         *
         * @param {string} c 字符或者字符编码
         *
         * @return {?number} 返回glyf索引号
         */
        getGlyfIndexByCode(c: string | number): number
    
        /**
         * 根据索引获取字形
         *
         * @param {number} glyfIndex glyf的索引
         *
         * @return {?Object} 返回glyf对象
         */
        getGlyfByIndex(glyfIndex: number): Glyf
    
        /**
         * 根据编码获取字形
         *
         * @param {string} c 字符或者字符编码
         *
         * @return {?Object} 返回glyf对象
         */
        getGlyfByCode(c: string | number): Glyf
    
        /**
         * 设置ttf对象
         *
         * @param {Object} ttf ttf对象
         * @return {this}
         */
        set(ttfObject: TTFObject): this
    
        /**
         * 获取ttf对象
         *
         * @return {ttfObject} ttf ttf对象
         */
        get(): TTFObject
    
        /**
         * 添加glyf
         *
         * @param {Object} glyf glyf对象
         *
         * @return {number} 添加的glyf
         */
        addGlyf(glyf: Glyf): Glyf[]
    
        /**
         * 插入glyf
         *
         * @param {Object} glyf glyf对象
         * @param {Object} insertIndex 插入的索引
         * @return {number} 添加的glyf
         */
        insertGlyf(glyf: Glyf, insertIndex: number): Glyf[]
    
        /**
         * 合并两个ttfObject，此处仅合并简单字形
         *
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
         *                                     (和 options.scale 参数互斥)
         *
         * @return {Array} 添加的glyf
         */
        mergeGlyf(ttfObject: TTFObject, options: FontMergeOptions): TTFObject
    
        /**
         * 删除指定字形
         *
         * @param {Array} indexList 索引列表
         * @return {Array} 删除的glyf
         */
        removeGlyf(indexList: number[]): Glyf[]
    
        /**
         * 设置unicode代码
         *
         * @param {string} unicode unicode代码 $E021, $22
         * @param {Array=} indexList 索引列表
         * @param {boolean} isGenerateName 是否生成name
         * @return {Array} 改变的glyf
         */
        setUnicode(unicode: string, indexList: number[], isGenerateName: boolean): Glyf[]
    
        /**
         * 生成字形名称
         *
         * @param {Array=} indexList 索引列表
         * @return {Array} 改变的glyf
         */
        genGlyfName(indexList: number[]): Glyf[]
    
        /**
         * 清除字形名称
         *
         * @param {Array=} indexList 索引列表
         * @return {Array} 改变的glyf
         */
        clearGlyfName(indexList: number[]): Glyf[]
    
         /**
         * 添加并体替换指定的glyf
         *
         * @param {Array} glyfList 添加的列表
         * @param {Array=} indexList 需要替换的索引列表
         * @return {Array} 改变的glyf
         */
        appendGlyf(glyfList: Glyf[], indexList: number[]): Glyf[]
    
        /**
         * 调整glyf位置
         *
         * @param {Array=} indexList 索引列表
         * @param {Object} setting 选项
         * @param {number=} setting.leftSideBearing 左边距
         * @param {number=} setting.rightSideBearing 右边距
         * @param {number=} setting.verticalAlign 垂直对齐
         * @return {Array} 改变的glyf
         */
        adjustGlyfPos(indexList: number[], setting: GlyfPosSettings): Glyf[]
    
         /**
         * 调整glyf
         *
         * @param {Array=} indexList 索引列表
         * @param {Object} setting 选项
         * @param {boolean=} setting.reverse 字形反转操作
         * @param {boolean=} setting.mirror 字形镜像操作
         * @param {number=} setting.scale 字形缩放
         * @param {boolean=} setting.ajdustToEmBox  是否调整字形到 em 框
         * @param {number=} setting.ajdustToEmPadding 调整到 em 框的留白
         * @return {boolean}
         */
        adjustGlyf(indexList: number[], setting: GlyfSettings): Glyf[]
    
        /**
         * 获取glyf列表
         *
         * @param {Array=} indexList 索引列表
         * @return {Array} glyflist
         */
        getGlyf(indexList: number[],): Glyf[]
    
        /**
         * 查找相关字形
         *
         * @param  {Object} condition 查询条件
         * @param  {Array|number} condition.unicode unicode编码列表或者单个unicode编码
         * @param  {string} condition.name glyf名字，例如`uniE001`, `uniE`
         * @param  {Function} condition.filter 自定义过滤器
         * @example
         *     condition.filter = function (glyf) {
         *         return glyf.name === 'logo';
         *     }
         * @return {Array}  glyf字形索引列表
         */
        findGlyf(condition: FontFindCondition): Glyf[]
    
        /**
         * 更新指定的glyf
         *
         * @param {Object} glyf glyfobject
         * @param {string} index 需要替换的索引列表
         * @return {Array} 改变的glyf
         */
        replaceGlyf(glyf: Glyf, index: number): Glyf[]
    
        /**
         * 设置glyf
         *
         * @param {Array} glyfList glyf列表
         * @return {Array} 设置的glyf列表
         */
        setGlyf(glyfList: Glyf[]): Glyf[]
    
        /**
         * 对字形按照unicode编码排序，此处不对复合字形进行排序，如果存在复合字形, 不进行排序
         *
         * @param {Array} glyfList glyf列表
         * @return {Array} 设置的glyf列表
         */
        sortGlyf(): Glyf[]
        
        /**
         * 设置名字
         *
         * @param {string} name 名字字段
         * @return {Object} 名字对象
         */
        setName(name: TTFObject['name']): TTFObject['name']
    
        /**
         * 设置head信息
         *
         * @param {Object} head 头部信息
         * @return {Object} 头对象
         */
        setHead(head: TTFObject['head']): TTFObject['head']
    
        /**
         * 设置hhea信息
         *
         * @param {Object} fields 字段值
         * @return {Object} 头对象
         */
        setHhea(hhea: TTFObject['hhea']): TTFObject['hhea']
    
        /**
         * 设置OS2信息
         *
         * @param {Object} fields 字段值
         * @return {Object} 头对象
         */
        setOS2(os2: TTFObject['OS/2']): TTFObject['OS/2']
    
        /**
         * 设置post信息
         *
         * @param {Object} fields 字段值
         * @return {Object} 头对象
         */
        setPost(os2: TTFObject['post']): TTFObject['post']
    
        /**
         * 计算度量信息
         *
         * @return {Object} 度量信息
         */
        calcMetrics(): FontMetrics
    
        /**
         * 优化ttf字形信息
         *
         * @return {Array} 改变的glyf
         */
        optimize(): Glyf[]
    
        /**
         * 复合字形转简单字形
         *
         * @param {Array=} indexList 索引列表
         * @return {Array} 改变的glyf
         */
        compound2simple(indexList?: number[]): Glyf[]
    }
    
    export class TTFReader {
    /**
         * ttf读取器的构造函数
         *
         * @param {Object} options 写入参数
         * @param {boolean} options.hinting 保留hinting信息
         * @param {boolean} options.compound2simple 复合字形转简单字形
         * @constructor
         */
        constructor(options: FontReadOptions)
    
        /**
         * 初始化读取
         *
         * @param {ArrayBuffer} buffer buffer对象
         * @return {Object} ttf对象
         */
        readBuffer(buffer: ArrayBuffer | Buffer | string): TTFObject
    
        /**
         * 关联glyf相关的信息
         *
         * @param {Object} ttf ttf对象
         */
        resolveGlyf(ttfObject: TTFObject): void
        
        /**
         * 清除非必须的表
         *
         * @param {Object} ttf ttf对象
         */
        cleanTables(ttfObject: TTFObject): void
        
        /**
         * 获取解析后的ttf文档
         *
         * @param {ArrayBuffer} buffer buffer对象
         * @return {Object} ttf文档
         */
        read(buffer: ArrayBuffer | Buffer | string): TTFObject
        
        /**
         * 注销
         */
        dispose(): void
    }
    
    export class TTFWriter {
        constructor(options: FontWriteOptions)
    
        /**
         * 处理ttf结构，以便于写
         *
         * @param {ttfObject} ttf ttf数据结构
         */
        resolveTTF(ttfObject: TTFObject): void
        
        /**
         * 写ttf文件
         *
         * @param {ttfObject} ttf ttf数据结构
         * @return {ArrayBuffer} 字节流
         */
        dump(ttfObject: TTFObject): ArrayBuffer | Buffer
        
         /**
         * 对ttf的表进行评估，标记需要处理的表
         *
         * @param  {Object} ttf ttf对象
         */
        prepareDump(ttfObject: TTFObject): void
        
        /**
         * 写一个ttf字体结构
         *
         * @param {Object} ttf ttf数据结构
         * @return {ArrayBuffer} 缓冲数组
         */
        write(ttfObject: TTFObject): ArrayBuffer | Buffer
        
        /**
         * 注销
         */
        dispose(): void
    }
    
    
    /** woff2 use wasm build of google woff2, before read and write woff2, you should first call woff2.init(). */
    export namespace woff2 {
        export function init(): Promise<void>
    }
}