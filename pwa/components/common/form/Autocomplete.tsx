// Generic interface for Suggestion
import {Control, Controller} from "react-hook-form";
import {useState} from "react";
import {useQuery} from "react-query";

export interface Suggestion<T> {
    "@id": string;
    [key: string]: T | string;
}

// Props definition for the Autocomplete component
interface AutocompleteProps<T> {
    control: Control;
    name: string;
    label: string;
    fetchSuggestions: (query: string) => Promise<ApiResponse<T>>;
    suggestionField: keyof Suggestion<T>; // The key to access the suggestion's main text (e.g., 'name', 'title')
    initialSuggestion?: Suggestion<T>
    className?: string;
}

interface ApiResponse<T> {
    'hydra:member': Suggestion<T>[]; // La clé contenant les suggestions
    'hydra:totalItems'?: number; // Si tu as une clé de pagination, ou un nombre total d'items
}

const Autocomplete = <T extends string>({
                                            control,
                                            name,
                                            label,
                                            fetchSuggestions,
                                            suggestionField,
                                            initialSuggestion,
                                            className

                                        }: AutocompleteProps<T>) => {
    const [query, setQuery] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<Suggestion<T> | undefined>(initialSuggestion);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    // Fetch suggestions with react-query
    const { data, isLoading, isError } = useQuery<ApiResponse<T>>(
        ['suggestions', query],
        () => fetchSuggestions(query),
        {
            enabled: query.length > 2, // Trigger fetch only when the query length is more than 2
            keepPreviousData: true, // Keep previous data while fetching new data
        }
    );

    const suggestions = data?.['hydra:member'] || [];

    // Handle option selection from the dropdown
    const handleSelectOption = (suggestion: Suggestion<T>, field: any) => {
        setSelectedOption(suggestion); // Update selected option state
        setQuery(suggestion[suggestionField] as string); // Set the input field to the selected option's property (e.g., 'name' or 'title')
        setIsDropdownOpen(false); // Close the dropdown
        field.onChange(suggestion['@id'] as string); // Update react-hook-form value
    };

    return (
        <div className={`${className} mb-4 relative`}>
            <label className="block text-white">{label}</label>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <>
                        <input
                            {...field}
                            type="text"
                            value={selectedOption ? selectedOption[suggestionField] : field.value} // Display the selected option's dynamic field or the query
                            onChange={(e) => {
                                setQuery(e.target.value); // Update the query on user input
                                field.onChange(e.target.value); // Update react-hook-form value
                                setSelectedOption(undefined); // Clear the selected option if the user starts typing
                                setIsDropdownOpen(true); // Open the dropdown when typing starts
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                           // className="mt-1 block w-full border text-primary border-gray-300 p-2 rounded"
                            placeholder="Commencez à taper quelques lettres"
                        />
                        {isLoading && query.length > 2 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg mt-1">
                                <div className="p-2">Chargement...</div>
                            </div>
                        )}
                        {isError && query.length > 2 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg mt-1">
                                <div className="p-2 text-red-600">Erreur donnée non récupéré</div>
                            </div>
                        )}
                        {isDropdownOpen && suggestions && query.length > 2 && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg mt-1">
                                {suggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        onClick={() => handleSelectOption(suggestion, field)} // Call handleSelectOption with the selected suggestion
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                    >
                                        {suggestion[suggestionField]} {/* Dynamically access the field */}
                                    </div>
                                ))}
                            </div>
                        )}
                        {suggestions && query.length > 2 && suggestions.length === 0 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg mt-1">
                                <div className="p-2 text-gray-600">Pas de résultat</div>
                            </div>
                        )}
                    </>
                )}
            />
        </div>
    );
};

export default Autocomplete;
