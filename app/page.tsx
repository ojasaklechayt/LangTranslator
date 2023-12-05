'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ISO6391 from 'iso-639-1';

interface Language {
  language: string;
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('es');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      const options = {
        method: 'GET',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/languages',
        headers: {
          'Accept-Encoding': 'application/gzip',
          'X-RapidAPI-Key': 'db4067a7a6msh4bcdbd5f750e5a9p1d4303jsnc9d565d5521a',
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        const languageData = response.data.data.languages as Language[];
        setLanguages(languageData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLanguages();
  }, []);

  const getLanguageFullName = (code: string) => {
    const language = languages.find((lang) => lang.language === code);
    const isoLanguageName = ISO6391.getName(code);
    return isoLanguageName || (language ? language.language : code);
  };

  const handleTranslate = async () => {
    setLoading(true);

    const encodedParams = new URLSearchParams();
    encodedParams.set('q', inputText);
    encodedParams.set('source', targetLanguage);
    encodedParams.set('target', sourceLanguage);

    const translationOptions = {
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': 'db4067a7a6msh4bcdbd5f750e5a9p1d4303jsnc9d565d5521a',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(translationOptions);
      setTranslatedText(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
  };

  const handleClearText = () => {
    setInputText('');
    setTranslatedText('');
  };

  return (
    <main className="flex flex-col items-start min-h-screen p-24">
      <div className="flex flex-row items-center justify-center gap-x-5 w-full">
        <div className="w-full">
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
          >
            {languages.map((language) => {
              const fullLanguageName = getLanguageFullName(language.language);
              return (
                <option key={language.language} value={language.language}>
                  {fullLanguageName}
                </option>
              );
            })}
          </select>
          <textarea
            id="message1"
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter the text to translate..."
          ></textarea>
        </div>
        <div className="w-full">
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
          >
            {languages.map((language) => {
              const fullLanguageName = getLanguageFullName(language.language);
              return (
                <option key={language.language} value={language.language}>
                  {fullLanguageName}
                </option>
              );
            })}
          </select>
          <textarea
            id="message2"
            rows={10}
            value={translatedText}
            readOnly
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your translated text here..."
          ></textarea>
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleTranslate}
          className={`p-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
        <button
          onClick={handleCopyToClipboard}
          className={`p-2 bg-green-500 text-white rounded ml-2 ${!translatedText ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!translatedText}
        >
          Copy to Clipboard
        </button>
        <button
          onClick={handleClearText}
          className="p-2 bg-gray-500 text-white rounded ml-2"
        >
          Clear Text
        </button>
      </div>
    </main>
  );
}
