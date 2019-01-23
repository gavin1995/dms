import React from "react";
import PropTypes from "prop-types";

class BaseInput extends React.Component {
  constructor(props) {
    super(props);
    this.realVal = 0;
  }

  componentDidMount() {
    if (this.props.schema.type === 'integer') {
      window.onload = () => {
        this.realVal = parseInt(this.inputElement.value, 10);
        // 手动触发onchange
        this.changeInputValue(0);
        this.changeInputValue(this.realVal);
      }
    }
  }

  changeInputValue = (val) => {
    const lastValue = this.inputElement.value;
    this.inputElement.value = val;
    const event = new Event('input', { bubbles: true });
    event.simulated = true;

    const tracker = this.inputElement._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    this.inputElement.dispatchEvent(event);
  };

  render() {
    if (!this.props.id) {
      console.log("No id for", this.props);
      throw new Error(`no id for props ${JSON.stringify(this.props)}`);
    }
    const {
      value,
      readonly,
      disabled,
      autofocus,
      onBlur,
      onFocus,
      options,
      schema,
      formContext,
      registry,
      rawErrors,
      ...inputProps
    } = this.props;

    inputProps.type = options.inputType || inputProps.type || "text";
    const _onChange = ({ target: { value } }) => {
      return this.props.onChange(value === "" ? options.emptyValue : value);
    };

    return (
      <input
        ref={(input) => { this.inputElement = input; }}
        className="form-control"
        readOnly={readonly}
        disabled={disabled}
        autoFocus={autofocus}
        value={value}
        {...inputProps}
        onChange={_onChange}
        onBlur={onBlur && (event => onBlur(inputProps.id, event.target.value))}
        onFocus={onFocus && (event => onFocus(inputProps.id, event.target.value))}
      />
    );
  }
}

BaseInput.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  BaseInput.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default BaseInput;
