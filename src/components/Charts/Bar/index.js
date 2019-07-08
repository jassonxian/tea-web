import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import ResizeObserver from 'resize-observer-polyfill';
import styles from '../index.less';

class Bar extends Component {
  state = {
    height: 0,
    autoHideXLabels: false,
  };

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };

  resizeObserver() {
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      this.resize();
      this.setState(preState => {
        if (preState.width !== width || preState.height !== height) {
          return {
            height,
          };
        }
        return null;
      });
    });
    if (this.root) {
      ro.observe(this.root);
    }
  }

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [], autoLabel = true } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }

  render() {
    const {
      height: propsHeight,
      title,
      forceFit = true,
      data,
      color = 'rgba(24, 144, 255, 0.85)',
      padding,
    } = this.props;

    const { autoHideXLabels } = this.state;

    const scale = {
      time: {
        type: 'cat',
      },
      count: {
        min: 0,
      },
      sub_agent_count: {
        min: 0,
      },
      agent_count: {
        min: 0,
      },
    };

    const tooltip = [
      'time*count',
      (time, count) => ({
        name: time,
        value: count,
      }),
    ];
    const { height: stateHeight } = this.state;
    const height = propsHeight || stateHeight;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'map',
      callback: row => {
        return {
          ...row,
          count: row.agent_count || 0 + row.sub_agent_count || 0,
        };
      },
    });
    return (
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            data={dv}
            padding={padding || 'auto'}
          >
            <Legend />
            <Axis
              name="time"
              title={false}
              label={autoHideXLabels ? false : {}}
              tickLine={autoHideXLabels ? false : {}}
            />
            <Axis name="count" min={0} />
            <Tooltip showTitle={false} crosshairs={false} />
            <Geom type="interval" position="time*count" color={color} tooltip={tooltip} />
          </Chart>
        </div>
      </div>
    );
  }
}

export default Bar;
