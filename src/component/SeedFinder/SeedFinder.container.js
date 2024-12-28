/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-magic-numbers */
import { PureComponent } from 'react';

import SeedsFinderQuery from 'Query/SeedsFinder.query';
import { scrollToTop } from 'SourceUtil/Browser';
import { fetchMutation, fetchQuery } from 'Util/Request';

import SeedFinder from './SeedFinder.component';
/** @namespace Seedsman/Component/SeedFinder/Container */
export class SeedFinderContainer extends PureComponent {
    containerFunctions = {
        handleClicked: this.handleClicked.bind(this),
        handleClick: this.handleClick.bind(this),
        handleOptionSelect: this.handleOptionSelect.bind(this),
        fetchResults: this.fetchResults.bind(this)
    };

    state = {
        questionId: 0,
        result: {},
        progressPercentage: 0,
        index: {},
        data: [],
        availableProducts: [],
        partialProduct: [],
        isLoading: false,
        products: {}
    };

    async componentDidMount() {
        this.setState({ isLoading: true });
        const query = SeedsFinderQuery.getSeedsQuestions();
        const { seeds } = await fetchQuery(query);

        this.setState({
            data: seeds
        });

        this.activetab();

        if (this.state.data) {
            return this.setState({ isLoading: false });
        }
    }

    componentDidUpdate() {
        this.activetab();
    }

    activetab() {
        const element = document.getElementsByClassName('QuestionName-active');
        if (!element.length) {
            return;
        }
        const htmlButtonsArray = Array.from(element);
        htmlButtonsArray?.map((val) => val.scrollIntoView({ inline: 'center' }));
        scrollToTop();
    }

    containerProps() {
        const {
            questionId,
            result,
            progressPercentage,
            index,
            data,
            availableProducts,
            isLoading,
            products,
            partialProduct
        } = this.state;

        return {
            questionId,
            result,
            progressPercentage,
            index,
            data,
            availableProducts,
            isLoading,
            products,
            partialProduct
        };
    }

    async fetchResults() {
        const { result } = this.state;
        const attributeCodes = [];
        const attributeIds = [];
        Object.entries(result).forEach(([, option]) => {
            attributeIds.push(option.attribute_option);
            attributeCodes.push(option.attribute_code);
            return null;
        });

        const query = SeedsFinderQuery.getProductListQuery({
            attributeId: attributeIds.toString(),
            attributeCode: attributeCodes.toString()
        });

        const PartialProductQuery = SeedsFinderQuery.getPartialProductList({
            attributeId: attributeIds.toString(),
            attributeCode: attributeCodes.toString()
        });
        const {
            seedsFinderProductList: { items = [] }
        } = await fetchQuery(query);

        const {
            seedsFinderPartialProductList: { items: PartialProductItems = [] }
        } = await fetchQuery(PartialProductQuery);

        this.setState({
            availableProducts: items,
            partialProduct: PartialProductItems
        });
        this.setState({ isLoading: false });
    }

    handleClicked(id) {
        this.setState({
            questionId: id
        });
    }

    handleClick(questions) {
        const { questionId } = this.state;
        const percentage = ((questionId + 1) / questions.length) * 100;
        this.setState({
            questionId: questionId + 1,
            progressPercentage: percentage
        });
    }

    handleOptionSelect(option, questionId, optionID, attribute_option) {
        const { result, index, data: questions } = this.state;

        if (index[questionId]) {
            return this.setState(() => (
                {
                    result: {
                        ...Object.values(result).slice(0, questionId),
                        [questionId]: option
                    },
                    index: {
                        ...Object.values(index).slice(0, questionId),
                        [questionId]: attribute_option
                    }
                }),
            async () => {
                this.setState({ isLoading: true });
                if (questionId + 1 !== questions.length) {
                    const { result } = this.state;
                    const attributeCodes = [];
                    const attributeIds = [];
                    const sequence = [];
                    Object.entries(result).forEach(([i, option]) => {
                        attributeIds.push(option.attribute_option);
                        attributeCodes.push(option.attribute_code);
                        sequence.push(++i);
                        return null;
                    });

                    // fetch the next step status
                    const mutation = SeedsFinderQuery.getNextStepDetails({
                        sequence: sequence.toString(),
                        attributeId: attributeIds.toString(),
                        attributeCode: attributeCodes.toString()
                    });

                    const { seedsFinderOptionData } = await fetchMutation(
                        mutation
                    );
                    const tempQuestions = questions;
                    tempQuestions[questionId + 1].options = seedsFinderOptionData[0].options;
                    this.setState({
                        data: tempQuestions
                    });
                    this.setState({ isLoading: false });
                    // replace data[questionId+1] with new data
                } else {
                    this.fetchResults();
                }
            });
        }

        this.setState(
            {
                result: {
                    ...result,
                    [questionId]: option
                },
                index: {
                    ...index,
                    [questionId]: attribute_option
                }
            },
            async () => {
                this.setState({ isLoading: true });
                if (questionId + 1 !== questions.length) {
                    const { result } = this.state;
                    const attributeCodes = [];
                    const attributeIds = [];
                    const sequence = [];
                    Object.entries(result).forEach(([i, option]) => {
                        attributeIds.push(option.attribute_option);
                        attributeCodes.push(option.attribute_code);
                        sequence.push(++i);
                        return null;
                    });

                    // fetch the next step status
                    const mutation = SeedsFinderQuery.getNextStepDetails({
                        sequence: sequence.toString(),
                        attributeId: attributeIds.toString(),
                        attributeCode: attributeCodes.toString()
                    });

                    const { seedsFinderOptionData } = await fetchMutation(
                        mutation
                    );
                    const tempQuestions = questions;
                    tempQuestions[questionId + 1].options = seedsFinderOptionData[0].options;
                    this.setState({
                        data: tempQuestions
                    });
                    this.setState({ isLoading: false });
                    // replace data[questionId+1] with new data
                } else {
                    this.fetchResults();
                }
            }
        );
    }

    render() {
        return (
            <SeedFinder
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default SeedFinderContainer;
