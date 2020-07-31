/**
 * 结构构造器
 *
 * Made By Douzi＂
 */
import Core from 'node-corejs';

class TagStructure {
  constructor(structure) {
    this._structure = structure || [];
    this._tagDatas = []; // 所有tag信息组成的列表
    this._tagGroupDatas = {}; // 相同的KeyPath字符串及其对应tag组的映射关系
    this._scopeDatas = [{
      type: 'Object',
      key: '',
      keyPath: [],
      nodes: [],
    }]; // 域结构信息
    this._parseStructure(this._scopeDatas[0], [], this._structure);
  }

  _parseStructure(scopeData, keyPath, structure) {
    const { nodes } = scopeData;
    const keyPathStr = keyPath.join(',');
    const tagGroupData = this._tagGroupDatas[keyPathStr] || [];
    this._tagGroupDatas[keyPathStr] = tagGroupData;

    for (let i = 0; i < structure.length; i++) {
      const currentKeyPath = [...keyPath];
      const node = structure[i];
      const { tag, key, props } = node;
      currentKeyPath.push(key);
      const nodeData = { tag, key, keyPath: currentKeyPath };
      // 提取核心信息
      if (tag !== undefined) {
        this._tagDatas.push(nodeData);
        tagGroupData.push({ tag, key });
      }
      // 处理域信息
      (Core.Types.getType(key) === 'Number') && (scopeData.type = 'Array');
      const childScopeData = {
        type: 'Object',
        tag,
        key,
        keyPath: currentKeyPath,
        nodes: [],
      };
      nodes.push(childScopeData);
      // 递归总体结构
      props ? this._parseStructure(childScopeData, currentKeyPath, props) : (childScopeData.type = 'Value');
    }
  }

  /**
   * 提取tag值
   * @param {Object|Array} message - 待解析的结构
   */
  getTagValue(message) {
    const result = {};
    const tagDatas = [...this._tagDatas];

    // 使用消费模式进行迭代
    while (tagDatas.length > 0) {
      // 总是从第一个尚未被消费的tag执行逻辑
      const tagData = tagDatas[0];
      const { keyPath } = tagData;
      const preKeyPath = keyPath.slice(0, keyPath.length - 1);
      const preKeyPathStr = preKeyPath.join(',');
      // 得到要取出的tag列表
      const readTags = this._tagGroupDatas[preKeyPathStr];

      // 定位取值上下文
      let context = message;
      for (let i = 0; i < preKeyPath.length; i++) {
        const key = preKeyPath[i];
        context = context[key] || {};
      }

      // 进行迭代取值
      for (let i = 0; i < readTags.length; i++) {
        const { tag, key } = readTags[i];
        const value = context[key];
        value !== undefined && (result[tag] = value);
        // 取值后对tag进行消费
        let tagIndex = -1;
        for (let j = 0; j < tagDatas.length; j++) {
          const tagData = tagDatas[j];
          if (tagData.tag === tag) {
            tagIndex = j;
            break;
          }
        }
        tagIndex >= 0 && tagDatas.splice(tagIndex, 1);
      }
    }

    return result;
  }

  /**
   * 将tag值构造为完整结构
   * @param {Object} tagValue - 指定的tag及对应值
   * @param {Object} options - 构建配置项
   * @param {String} options.conflictMode - 冲突处理模式,支持三种模式:
   *                                        strict: 严格模式,在构建过程中只要检测到冲突(重复写值)就抛出异常
   *                                        normal: 普通模式(默认),在构建过程中出现覆盖型重复时才抛出异常,此时接受同级属性的自动合并
   *                                        loose: 宽松模式,在构建过程中将自动使用覆盖方式处理冲突,可能导致值被覆盖
   * @param {Any} options.defaultValue - 构造未被打tag的field时,如果值没有指定将使用此值,不传时将跳过field构建
   * @param {Any} options.defaultTagValue - 构造被打了tag的field时,如果值没有指定将使用此值,不传时将跳过field构建
   */
  buildMessage(tagValue, options = {}) {
    let result = null;
    const {
      conflictMode = 'normal',
      defaultValue,
      defaultTagValue,
    } = options;
    const isStrictMode = conflictMode === 'strict';
    const isNormalMode = conflictMode === 'normal';
    const { type, nodes } = this._scopeDatas[0];

    result = type === 'Object' ? {} : [];

    const buildStructure = (context, scopeDatas) => {
      for (let i = 0; i < scopeDatas.length; i++) {
        const scopeData = scopeDatas[i];
        const { tag, type, key, nodes } = scopeData;
        const isTagField = tag !== undefined;
        const isValueSeted = context[key] !== undefined;
        const hasDefaultValue = defaultValue !== undefined;

        // 对strict模式下进行重复写值检测
        if (isStrictMode && isValueSeted) {
          return key;
        }

        // 对normal模式下进行重复写值检测
        if (isNormalMode && isValueSeted) {
          return key;
        }

        /* * * * * * * * * * * * * * * * * * * * * * * *
         * 说明: 
         * 当写值失败时说明context已被写了不规范的非引用值
         * normal模式下将直接报错
         * loose模式下将根据其上一层类型重新创建并覆盖context
         * 此处产生的Error将在上一级的递归执行时被捕获
         * * * * * * * * * * * * * * * * * * * * * * * */

        // 待构建field被打了tag
        if (isTagField) {
          const value = tagValue[tag] === undefined ? defaultTagValue : tagValue[tag];
          // 当业务层指定了tag的值或设置了兜底值时触发写值(tag值有效)
          // 此处已判断了normal模式且已被写值的情况,只有loose模式,或normal模式未被写值
          // 因此直接执行写值动作
          if (value !== undefined) {
            context[key] = value;
          }
          // 当tag值无效时,根据节点的类型执行创建并写值
          // 如果field已设置了值(此时一定为loose模式)或为value类型将跳过写值
          else if (!isValueSeted) {
            if (type === 'Object') {
              context[key] = {};
            } else if (type === 'Array') {
              context[key] = [];
            }
          }
        }
        // 待构建field未被打tag
        else if (!isValueSeted) {
          // 如果已被写值(则此时一定为loose模式) - 跳过构构建写值阶段
          // 如果未被写值,则可能是normal模式或loose模式 - 此时进行构建并写值
          if (type === 'Object') {
            context[key] = {};
          } else if (type === 'Array') {
            context[key] = [];
          } else if (type === 'Value' && hasDefaultValue) {
            context[key] = defaultValue;
          }
        }

        // 递归构建子节点
        try {
          const conflictKey = buildStructure(context[key], nodes);
          if (conflictKey) { return conflictKey }
        }
        catch (err) {
          // 当写值失败时说明context已被写了不规范的非引用值
          // normal模式下将直接报错
          // loose模式下将重新写入正确的context类型并重新迭代
          if (isNormalMode) {
            return key;
          } else {
            context[key] = type === 'Object' ? {} : [];
            const conflictKey = buildStructure(context[key], nodes);
            if (conflictKey) { return conflictKey }
          }
        }
      }
    };

    const conflictKey = buildStructure(result, nodes);
    if (conflictKey) {
      throw new Error(`当前模式下无法对[${conflictKey}]重复写值`);
    }
    return result;
  }
}

export default TagStructure;
