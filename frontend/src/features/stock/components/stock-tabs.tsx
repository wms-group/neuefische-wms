import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react';
import LayoutContainer from '@/components/shared/layout-container';
import {CreateStockForm, DeleteStockForm} from "@/features/stock";

const tabs = [
    { name: 'Add Stock', component: <CreateStockForm /> },
    { name: 'Remove Stock', component: <DeleteStockForm /> },
];

const StockTabs = () => {
    return (
        <LayoutContainer className="h-full">
            <TabGroup className="w-full h-full">
                <TabList className="flex gap-4 border-b border-gray-200 w-full">
                    {tabs.map(({ name }) => (
                        <Tab
                            key={name}
                            className="rounded-t-md px-4 py-2 text-sm font-medium text-gray-600 data-selected:bg-blue-100 data-selected:text-blue-600 data-hover:bg-gray-100 focus:outline-none"
                        >
                            {name}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-4 max-w-5xl">
                    {tabs.map(({ name, component }) => (
                        <TabPanel key={name} className="bg-white p-4 shadow">
                            {component}
                        </TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </LayoutContainer>
    );
};

export default StockTabs;
