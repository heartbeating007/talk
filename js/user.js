// 注册登陆验证通用方法
class FieldValidator {
  /**
   * 构造器
   * @param {String} txtId 文本框的Id
   * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，
   * 函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
   */
  constructor(txtId, validatorFn) {
    this.input = $('#' + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFn = validatorFn;
    //  input 失去焦点验证
    this.input.onblur = () => {
      this.validate();
    };
  }

  /**
   * 验证，成功返回true，失败返回false
   */
  async validate() {
    const err = await this.validatorFn(this.input.value);
    if (err) {
      // 有错误
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = '';
      return true;
    }
  }

  /**
   * 对传入的所有验证器进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    //   调用所有验证器的验证方法，返回一个promise数组
    const proms = validators.map((v) => v.validate());
    //   等待promise数组全部完成后的数据
    const results = await Promise.all(proms);
    //promise数组里面是不是所有的都为true，是返回true，否则返回false
    return results.every((r) => r);
  }
}
