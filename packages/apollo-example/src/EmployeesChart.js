import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel } from '@extjs/ext-react';   
import { Cartesian } from '@extjs/ext-react-charts';
import { connect } from 'react-redux';
import { gql } from 'react-apollo';
import { avgBy } from './util/data';

Ext.require([
    'Ext.chart.axis.Numeric',
    'Ext.chart.axis.Category',
    'Ext.chart.series.Line',
]);

export default class EmployeesChart extends Component {

    static propTypes = {
        employees: PropTypes.object
    };

    static fragment = gql`
        fragment EmployeesChart on EmployeesResult {
            records {
                yearsActive
                rating
            }
        }    
    `

    render() {
        const { data: { employees, refetch, loading }, ...chartProps } = this.props;

        return (
            <Panel layout="fit" {...chartProps}>
                <Cartesian
                    captions={{
                        title: 'Avg Rating by Years Active'
                    }}
                    shadow
                    insetPadding="40 40 60 40"
                    store={avgBy(employees && employees.records, 'yearsActive', 'rating')}
                    series={{
                        type: 'line',
                        xField: 'yearsActive',
                        yField: 'rating',
                    }}
                    axes={[{
                        type: 'numeric',
                        position: 'left',
                        fields: 'rating',
                        title: 'Avg. Rating'
                    }, {
                        type: 'category',
                        position: 'bottom',
                        fields: 'yearsActive',
                        title: 'Years Active'
                    }]}
                />
            </Panel>
        )
    }
}