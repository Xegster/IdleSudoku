import React from 'react';
import { Box, Text, Button, ButtonText, VStack } from '@gluestack-ui/themed';
import { Alert } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box flex={1} justifyContent="center" alignItems="center" p="$4" bg="$white">
          <VStack space="md" alignItems="center">
            <Text size="xl" fontWeight="$bold" color="$red600">
              Something went wrong
            </Text>
            <Text size="sm" color="$gray600" textAlign="center">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            {__DEV__ && this.state.errorInfo && (
              <Box bg="$gray100" p="$2" borderRadius="$md" maxWidth="90%">
                <Text size="xs" fontFamily="monospace" color="$gray800">
                  {this.state.errorInfo.componentStack}
                </Text>
              </Box>
            )}
            <Button onPress={this.handleReset} variant="solid">
              <ButtonText>Try Again</ButtonText>
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

