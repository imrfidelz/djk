interface CartStepsProps {
  currentStep: number;
}

export const CartSteps = ({ currentStep }: CartStepsProps) => {
  const steps = [
    { number: 1, title: 'SHOPPING CART' },
    { number: 2, title: 'CHECKOUT DETAILS' },
    { number: 3, title: 'ORDER COMPLETE' }
  ];

  return (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
              step.number <= currentStep
                ? 'bg-luxury-gold text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step.number}
            </div>
            <span className={`ml-2 mr-4 font-medium ${
              step.number <= currentStep
                ? 'text-luxury-gold'
                : 'text-gray-400'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className="h-px bg-gray-300 w-8"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};