import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../Languages/useTranslation';
import { useLanguage } from '../Languages/i18n2lang.jsx';

// ---
// DICTIONARY PAGE I18N TRANSLATION SYSTEM
// This page supports English (default) and Filipino (from translations.js).
// The useTranslation hook provides the t(key) function, which:
//   1. Looks up the translation for the current language (Filipino) in translations.js.
//   2. If not found, falls back to the English/default value (the original word/category).
//   3. This ensures the UI always displays something, even if a translation is missing.
//   4. All dictionary words and categories should have a Filipino translation in translations.js for full coverage.
// ---

// Dictionary data: word, video, description, and category
const dictionaryData = [
  // Alphabet & Fingerspelling
  { word: 'A', video: '/FSLAssetsVideos/Fundamentals/alphabet/A.mp4', description: 'A', category: 'Alphabet & Fingerspelling' },
  { word: 'B', video: '/FSLAssetsVideos/Fundamentals/alphabet/B.mp4', description: 'B', category: 'Alphabet & Fingerspelling' },
  { word: 'C', video: '/FSLAssetsVideos/Fundamentals/alphabet/C.mp4', description: 'C', category: 'Alphabet & Fingerspelling' },
  { word: 'D', video: '/FSLAssetsVideos/Fundamentals/alphabet/D.mp4', description: 'D', category: 'Alphabet & Fingerspelling' },
  { word: 'E', video: '/FSLAssetsVideos/Fundamentals/alphabet/E.mp4', description: 'E', category: 'Alphabet & Fingerspelling' },
  { word: 'F', video: '/FSLAssetsVideos/Fundamentals/alphabet/F.mp4', description: 'F', category: 'Alphabet & Fingerspelling' },
  { word: 'G', video: '/FSLAssetsVideos/Fundamentals/alphabet/G.mp4', description: 'G', category: 'Alphabet & Fingerspelling' },
  { word: 'H', video: '/FSLAssetsVideos/Fundamentals/alphabet/H.mp4', description: 'H', category: 'Alphabet & Fingerspelling' },
  { word: 'I', video: '/FSLAssetsVideos/Fundamentals/alphabet/I.mp4', description: 'I', category: 'Alphabet & Fingerspelling' },
  { word: 'J', video: '/FSLAssetsVideos/Fundamentals/alphabet/J.mp4', description: 'J', category: 'Alphabet & Fingerspelling' },
  { word: 'K', video: '/FSLAssetsVideos/Fundamentals/alphabet/K.mp4', description: 'K', category: 'Alphabet & Fingerspelling' },
  { word: 'L', video: '/FSLAssetsVideos/Fundamentals/alphabet/L.mp4', description: 'L', category: 'Alphabet & Fingerspelling' },
  { word: 'M', video: '/FSLAssetsVideos/Fundamentals/alphabet/M.mp4', description: 'M', category: 'Alphabet & Fingerspelling' },
  { word: 'N', video: '/FSLAssetsVideos/Fundamentals/alphabet/N.mp4', description: 'N', category: 'Alphabet & Fingerspelling' },
  { word: 'Ñ', video: '/FSLAssetsVideos/Fundamentals/alphabet/Ñ.mp4', description: 'Ñ', category: 'Alphabet & Fingerspelling' },
  { word: 'Ng', video: '/FSLAssetsVideos/Fundamentals/alphabet/Ng.mp4', description: 'Ng', category: 'Alphabet & Fingerspelling' },
  { word: 'O', video: '/FSLAssetsVideos/Fundamentals/alphabet/O.mp4', description: 'O', category: 'Alphabet & Fingerspelling' },
  { word: 'P', video: '/FSLAssetsVideos/Fundamentals/alphabet/P.mp4', description: 'P', category: 'Alphabet & Fingerspelling' },
  { word: 'Q', video: '/FSLAssetsVideos/Fundamentals/alphabet/Q.mp4', description: 'Q', category: 'Alphabet & Fingerspelling' },
  { word: 'R', video: '/FSLAssetsVideos/Fundamentals/alphabet/R.mp4', description: 'R', category: 'Alphabet & Fingerspelling' },
  { word: 'S', video: '/FSLAssetsVideos/Fundamentals/alphabet/S.mp4', description: 'S', category: 'Alphabet & Fingerspelling' },
  { word: 'T', video: '/FSLAssetsVideos/Fundamentals/alphabet/T.mp4', description: 'T', category: 'Alphabet & Fingerspelling' },
  { word: 'U', video: '/FSLAssetsVideos/Fundamentals/alphabet/U.mp4', description: 'U', category: 'Alphabet & Fingerspelling' },
  { word: 'V', video: '/FSLAssetsVideos/Fundamentals/alphabet/V.mp4', description: 'V', category: 'Alphabet & Fingerspelling' },
  { word: 'W', video: '/FSLAssetsVideos/Fundamentals/alphabet/W.mp4', description: 'W', category: 'Alphabet & Fingerspelling' },
  { word: 'X', video: '/FSLAssetsVideos/Fundamentals/alphabet/X.mp4', description: 'X', category: 'Alphabet & Fingerspelling' },
  { word: 'Y', video: '/FSLAssetsVideos/Fundamentals/alphabet/Y.mp4', description: 'Y', category: 'Alphabet & Fingerspelling' },
  { word: 'Z', video: '/FSLAssetsVideos/Fundamentals/alphabet/Z.mp4', description: 'Z', category: 'Alphabet & Fingerspelling' },

  // Numbers
  { word: '1', video: '/FSLAssetsVideos/Fundamentals/numbers/1.mp4', description: '1', category: 'Numbers' },
  { word: '2', video: '/FSLAssetsVideos/Fundamentals/numbers/2.mp4', description: '2', category: 'Numbers' },
  { word: '3', video: '/FSLAssetsVideos/Fundamentals/numbers/3.mp4', description: '3', category: 'Numbers' },
  { word: '4', video: '/FSLAssetsVideos/Fundamentals/numbers/4.mp4', description: '4', category: 'Numbers' },
  { word: '5', video: '/FSLAssetsVideos/Fundamentals/numbers/5.mp4', description: '5', category: 'Numbers' },
  { word: '6', video: '/FSLAssetsVideos/Fundamentals/numbers/6.mp4', description: '6', category: 'Numbers' },
  { word: '7', video: '/FSLAssetsVideos/Fundamentals/numbers/7.mp4', description: '7', category: 'Numbers' },
  { word: '8', video: '/FSLAssetsVideos/Fundamentals/numbers/8.mp4', description: '8', category: 'Numbers' },
  { word: '9', video: '/FSLAssetsVideos/Fundamentals/numbers/9.mp4', description: '9', category: 'Numbers' },
  { word: '10', video: '/FSLAssetsVideos/Fundamentals/numbers/10.mp4', description: '10', category: 'Numbers' },
  { word: '11', video: '/FSLAssetsVideos/Fundamentals/numbers/11.mp4', description: '11', category: 'Numbers' },
  { word: '12', video: '/FSLAssetsVideos/Fundamentals/numbers/12.mp4', description: '12', category: 'Numbers' },
  { word: '13', video: '/FSLAssetsVideos/Fundamentals/numbers/13.mp4', description: '13', category: 'Numbers' },
  { word: '14', video: '/FSLAssetsVideos/Fundamentals/numbers/14.mp4', description: '14', category: 'Numbers' },
  { word: '15', video: '/FSLAssetsVideos/Fundamentals/numbers/15.mp4', description: '15', category: 'Numbers' },
  { word: '16', video: '/FSLAssetsVideos/Fundamentals/numbers/16.mp4', description: '16', category: 'Numbers' },
  { word: '17', video: '/FSLAssetsVideos/Fundamentals/numbers/17.mp4', description: '17', category: 'Numbers' },
  { word: '18', video: '/FSLAssetsVideos/Fundamentals/numbers/18.mp4', description: '18', category: 'Numbers' },
  { word: '19', video: '/FSLAssetsVideos/Fundamentals/numbers/19.mp4', description: '19', category: 'Numbers' },
  { word: '20', video: '/FSLAssetsVideos/Fundamentals/numbers/20.mp4', description: '20', category: 'Numbers' },
  { word: '21', video: '/FSLAssetsVideos/Fundamentals/numbers/21.mp4', description: '21', category: 'Numbers' },
  { word: '22', video: '/FSLAssetsVideos/Fundamentals/numbers/22.mp4', description: '22', category: 'Numbers' },
  { word: '23', video: '/FSLAssetsVideos/Fundamentals/numbers/23.mp4', description: '23', category: 'Numbers' },
  { word: '24', video: '/FSLAssetsVideos/Fundamentals/numbers/24.mp4', description: '24', category: 'Numbers' },
  { word: '25', video: '/FSLAssetsVideos/Fundamentals/numbers/25.mp4', description: '25', category: 'Numbers' },
  { word: '26', video: '/FSLAssetsVideos/Fundamentals/numbers/26.mp4', description: '26', category: 'Numbers' },
  { word: '27', video: '/FSLAssetsVideos/Fundamentals/numbers/27.mp4', description: '27', category: 'Numbers' },
  { word: '28', video: '/FSLAssetsVideos/Fundamentals/numbers/28.mp4', description: '28', category: 'Numbers' },
  { word: '29', video: '/FSLAssetsVideos/Fundamentals/numbers/29.mp4', description: '29', category: 'Numbers' },
  { word: '30', video: '/FSLAssetsVideos/Fundamentals/numbers/30.mp4', description: '30', category: 'Numbers' },
  { word: '40', video: '/FSLAssetsVideos/Fundamentals/numbers/40.mp4', description: '40', category: 'Numbers' },
  { word: '50', video: '/FSLAssetsVideos/Fundamentals/numbers/50.mp4', description: '50', category: 'Numbers' },
  { word: '60', video: '/FSLAssetsVideos/Fundamentals/numbers/60.mp4', description: '60', category: 'Numbers' },
  { word: '70', video: '/FSLAssetsVideos/Fundamentals/numbers/70.mp4', description: '70', category: 'Numbers' },
  { word: '80', video: '/FSLAssetsVideos/Fundamentals/numbers/80.mp4', description: '80', category: 'Numbers' },
  { word: '90', video: '/FSLAssetsVideos/Fundamentals/numbers/90.mp4', description: '90', category: 'Numbers' },
  { word: '100', video: '/FSLAssetsVideos/Fundamentals/numbers/100.mp4', description: '100', category: 'Numbers' },
  { word: '200', video: '/FSLAssetsVideos/Fundamentals/numbers/200.mp4', description: '200', category: 'Numbers' },
  { word: '300', video: '/FSLAssetsVideos/Fundamentals/numbers/300.mp4', description: '300', category: 'Numbers' },
  { word: '400', video: '/FSLAssetsVideos/Fundamentals/numbers/400.mp4', description: '400', category: 'Numbers' },
  { word: '500', video: '/FSLAssetsVideos/Fundamentals/numbers/500.mp4', description: '500', category: 'Numbers' },
  { word: '600', video: '/FSLAssetsVideos/Fundamentals/numbers/600.mp4', description: '600', category: 'Numbers' },
  { word: '700', video: '/FSLAssetsVideos/Fundamentals/numbers/700.mp4', description: '700', category: 'Numbers' },
  { word: '800', video: '/FSLAssetsVideos/Fundamentals/numbers/800.mp4', description: '800', category: 'Numbers' },
  { word: '900', video: '/FSLAssetsVideos/Fundamentals/numbers/900.mp4', description: '900', category: 'Numbers' },
  { word: '1000', video: '/FSLAssetsVideos/Fundamentals/numbers/1000.mp4', description: '1000', category: 'Numbers' },

  // Common Questions
  { word: 'Can you help me?', video: '/FSLAssetsVideos/Fundamentals/commonQuestion/Canyouhelpme.mp4', description: 'Can you help me?', category: 'Common Questions' },
  { word: 'Do you understand?', video: '/FSLAssetsVideos/Fundamentals/commonQuestion/Doyouunderstand.mp4', description: 'Do you understand?', category: 'Common Questions' },
  { word: 'How are you?', video: '/FSLAssetsVideos/Fundamentals/commonQuestion/Howareyou.mp4', description: 'How are you?', category: 'Common Questions' },
  { word: 'How old are you?', video: '/FSLAssetsVideos/Fundamentals/commonQuestion/Howoldareyou.mp4', description: 'How old are you?', category: 'Common Questions' },
  { word: 'What do you want?', video: '/FSLAssetsVideos/Fundamentals/commonQuestion/Whatdoyouwant.mp4', description: 'What do you want?', category: 'Common Questions' },
  { word: 'What is your name?', video: '/FSLAssetsVideos/Fundamentals/commonQuestion/Whatisyourname.mp4', description: 'What is your name?', category: 'Common Questions' },
  { word: 'What time is it?', video: '/FSLAssetsVideos/Fundamentals/commonQuestion/Whattimeisit.mp4', description: 'What time is it?', category: 'Common Questions' },
  { word: 'Where are you from?', video: '/FSLAssetsVideos/Fundamentals/commonQuestion/Whereareyoufrom.mp4', description: 'Where are you from?', category: 'Common Questions' },
  { word: 'Where do you live?', video: '/FSLAssetsVideos/Fundamentals/commonQuestion/Wheredoyoulive.mp4', description: 'Where do you live?', category: 'Common Questions' },

  // Simple Phrases
  { word: "I don't understand", video: '/FSLAssetsVideos/Fundamentals/simplePhrases/Idontunderstand.mp4', description: "I don't understand", category: 'Simple Phrases' },
  { word: 'Nice to meet you', video: '/FSLAssetsVideos/Fundamentals/simplePhrases/Nicetomeetyou.mp4', description: 'Nice to meet you', category: 'Simple Phrases' },
  { word: 'Please', video: '/FSLAssetsVideos/Fundamentals/simplePhrases/Please.mp4', description: 'Please', category: 'Simple Phrases' },
  { word: "You're welcome", video: '/FSLAssetsVideos/Fundamentals/simplePhrases/Yourewelcome.mp4', description: "You're welcome", category: 'Simple Phrases' },
  { word: 'Thank you', video: '/FSLAssetsVideos/Fundamentals/simplePhrases/Thankyouvt.mp4', description: 'Thank you', category: 'Simple Phrases' },
  { word: 'Sorry', video: '/FSLAssetsVideos/Fundamentals/simplePhrases/Sorryvt.mp4', description: 'Sorry', category: 'Simple Phrases' },
  { word: 'Yes', video: '/FSLAssetsVideos/Fundamentals/simplePhrases/Yesvt.mp4', description: 'Yes', category: 'Simple Phrases' },
  { word: 'No', video: '/FSLAssetsVideos/Fundamentals/simplePhrases/Novt.mp4', description: 'No', category: 'Simple Phrases' },

  // Greetings & Polite Expressions
  { word: 'Fine', video: '/FSLAssetsVideos/EeveryDayWords/greetings&PoliteExpressions/Fine.mp4', description: 'Fine', category: 'Greetings & Polite Expressions' },
  { word: 'Good afternoon', video: '/FSLAssetsVideos/EeveryDayWords/greetings&PoliteExpressions/Goodafternoon.mp4', description: 'Good afternoon', category: 'Greetings & Polite Expressions' },
  { word: 'Good evening', video: '/FSLAssetsVideos/EeveryDayWords/greetings&PoliteExpressions/Goodevening.mp4', description: 'Good evening', category: 'Greetings & Polite Expressions' },
  { word: 'Good morning', video: '/FSLAssetsVideos/EeveryDayWords/greetings&PoliteExpressions/Goodmorning.mp4', description: 'Good morning', category: 'Greetings & Polite Expressions' },
  { word: 'Good night', video: '/FSLAssetsVideos/EeveryDayWords/greetings&PoliteExpressions/Goodnight.mp4', description: 'Good night', category: 'Greetings & Polite Expressions' },
  { word: 'Goodbye', video: '/FSLAssetsVideos/EeveryDayWords/greetings&PoliteExpressions/Goodbye.mp4', description: 'Goodbye', category: 'Greetings & Polite Expressions' },
  { word: 'Hello', video: '/FSLAssetsVideos/EeveryDayWords/greetings&PoliteExpressions/Hello.mp4', description: 'Hello', category: 'Greetings & Polite Expressions' },
  { word: 'How are you?', video: '/FSLAssetsVideos/EeveryDayWords/greetings&PoliteExpressions/Howareyou.mp4', description: 'How are you?', category: 'Greetings & Polite Expressions' },
  { word: 'Welcome', video: '/FSLAssetsVideos/EeveryDayWords/greetings&PoliteExpressions/Welcome.mp4', description: 'Welcome', category: 'Greetings & Polite Expressions' },

  // Days of the Week & Months
  { word: 'Monday', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Monday.mp4', description: 'Monday', category: 'Days of the Week & Months' },
  { word: 'Tuesday', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Tuesday.mp4', description: 'Tuesday', category: 'Days of the Week & Months' },
  { word: 'Wednesday', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Wednesday.mp4', description: 'Wednesday', category: 'Days of the Week & Months' },
  { word: 'Thursday', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Thursday.mp4', description: 'Thursday', category: 'Days of the Week & Months' },
  { word: 'Friday', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Friday.mp4', description: 'Friday', category: 'Days of the Week & Months' },
  { word: 'Saturday', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Saturday.mp4', description: 'Saturday', category: 'Days of the Week & Months' },
  { word: 'Sunday', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Sunday.mp4', description: 'Sunday', category: 'Days of the Week & Months' },
  { word: 'Today', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Today.mp4', description: 'Today', category: 'Days of the Week & Months' },
  { word: 'Tomorrow', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Tomorrow.mp4', description: 'Tomorrow', category: 'Days of the Week & Months' },
  { word: 'Yesterday', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Yesterday.mp4', description: 'Yesterday', category: 'Days of the Week & Months' },
  { word: 'January', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/Jan.mp4', description: 'January', category: 'Days of the Week & Months' },
  { word: 'February', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/Feb.mp4', description: 'February', category: 'Days of the Week & Months' },
  { word: 'March', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/March.mp4', description: 'March', category: 'Days of the Week & Months' },
  { word: 'April', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/April.mp4', description: 'April', category: 'Days of the Week & Months' },
  { word: 'May', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/May.mp4', description: 'May', category: 'Days of the Week & Months' },
  { word: 'June', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/June.mp4', description: 'June', category: 'Days of the Week & Months' },
  { word: 'July', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/July.mp4', description: 'July', category: 'Days of the Week & Months' },
  { word: 'August', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/August.mp4', description: 'August', category: 'Days of the Week & Months' },
  { word: 'September', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/Sept.mp4', description: 'September', category: 'Days of the Week & Months' },
  { word: 'October', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/Oct.mp4', description: 'October', category: 'Days of the Week & Months' },
  { word: 'November', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/Nov.mp4', description: 'November', category: 'Days of the Week & Months' },
  { word: 'December', video: '/FSLAssetsVideos/EeveryDayWords/daysOfTheWeek&Months/Months/Dec.mp4', description: 'December', category: 'Days of the Week & Months' },

  // Colors
  { word: 'Black', video: '/FSLAssetsVideos/EeveryDayWords/colors/Black.mp4', description: 'Black', category: 'Colors' },
  { word: 'Blue', video: '/FSLAssetsVideos/EeveryDayWords/colors/Blue.mp4', description: 'Blue', category: 'Colors' },
  { word: 'Brown', video: '/FSLAssetsVideos/EeveryDayWords/colors/Brown.mp4', description: 'Brown', category: 'Colors' },
  { word: 'Gray', video: '/FSLAssetsVideos/EeveryDayWords/colors/Gray.mp4', description: 'Gray', category: 'Colors' },
  { word: 'Green', video: '/FSLAssetsVideos/EeveryDayWords/colors/Green.mp4', description: 'Green', category: 'Colors' },
  { word: 'Orange', video: '/FSLAssetsVideos/EeveryDayWords/colors/Orange.mp4', description: 'Orange', category: 'Colors' },
  { word: 'Pink', video: '/FSLAssetsVideos/EeveryDayWords/colors/Pink.mp4', description: 'Pink', category: 'Colors' },
  { word: 'Purple', video: '/FSLAssetsVideos/EeveryDayWords/colors/Purple.mp4', description: 'Purple', category: 'Colors' },
  { word: 'Red', video: '/FSLAssetsVideos/EeveryDayWords/colors/Red.mp4', description: 'Red', category: 'Colors' },
  { word: 'White', video: '/FSLAssetsVideos/EeveryDayWords/colors/White.mp4', description: 'White', category: 'Colors' },
  { word: 'Yellow', video: '/FSLAssetsVideos/EeveryDayWords/colors/Yellow.mp4', description: 'Yellow', category: 'Colors' },

  // Family Members
  { word: 'Aunt', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Aunt.mp4', description: 'Aunt', category: 'Family Members' },
  { word: 'Baby', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Baby.mp4', description: 'Baby', category: 'Family Members' },
  { word: 'Brother', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Brother.mp4', description: 'Brother', category: 'Family Members' },
  { word: 'Cousin', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Cousin.mp4', description: 'Cousin', category: 'Family Members' },
  { word: 'Father', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Father.mp4', description: 'Father', category: 'Family Members' },
  { word: 'Grandfather', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Grandfather.mp4', description: 'Grandfather', category: 'Family Members' },
  { word: 'Grandmother', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Grandmother.mp4', description: 'Grandmother', category: 'Family Members' },
  { word: 'Mother', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Mother.mp4', description: 'Mother', category: 'Family Members' },
  { word: 'Sister', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Sister.mp4', description: 'Sister', category: 'Family Members' },
  { word: 'Uncle', video: '/FSLAssetsVideos/EeveryDayWords/familyMembers/Uncle.mp4', description: 'Uncle', category: 'Family Members' },

  // Common Objects
  { word: 'Bag', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Bag.mp4', description: 'Bag', category: 'Common Objects' },
  { word: 'Book', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Book.mp4', description: 'Book', category: 'Common Objects' },
  { word: 'Chair', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Chair.mp4', description: 'Chair', category: 'Common Objects' },
  { word: 'Door', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Door.mp4', description: 'Door', category: 'Common Objects' },
  { word: 'Key', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Key.mp4', description: 'Key', category: 'Common Objects' },
  { word: 'Paper', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Paper.mp4', description: 'Paper', category: 'Common Objects' },
  { word: 'Pen', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Pen.mp4', description: 'Pen', category: 'Common Objects' },
  { word: 'Phone', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Phone.mp4', description: 'Phone', category: 'Common Objects' },
  { word: 'Table', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Table.mp4', description: 'Table', category: 'Common Objects' },
  { word: 'Window', video: '/FSLAssetsVideos/EeveryDayWords/commonObjects/Window.mp4', description: 'Window', category: 'Common Objects' },

  // Animals
  { word: 'Bird', video: '/FSLAssetsVideos/EeveryDayWords/animals/Bird.mp4', description: 'Bird', category: 'Animals' },
  { word: 'Cat', video: '/FSLAssetsVideos/EeveryDayWords/animals/Cat.mp4', description: 'Cat', category: 'Animals' },
  { word: 'Chicken', video: '/FSLAssetsVideos/EeveryDayWords/animals/Chicken.mp4', description: 'Chicken', category: 'Animals' },
  { word: 'Cow', video: '/FSLAssetsVideos/EeveryDayWords/animals/Cow.mp4', description: 'Cow', category: 'Animals' },
  { word: 'Dog', video: '/FSLAssetsVideos/EeveryDayWords/animals/Dog.mp4', description: 'Dog', category: 'Animals' },
  { word: 'Elephant', video: '/FSLAssetsVideos/EeveryDayWords/animals/Elephant.mp4', description: 'Elephant', category: 'Animals' },
  { word: 'Fish', video: '/FSLAssetsVideos/EeveryDayWords/animals/Fish.mp4', description: 'Fish', category: 'Animals' },
  { word: 'Horse', video: '/FSLAssetsVideos/EeveryDayWords/animals/Horse.mp4', description: 'Horse', category: 'Animals' },
  { word: 'Pig', video: '/FSLAssetsVideos/EeveryDayWords/animals/Pig.mp4', description: 'Pig', category: 'Animals' },
  { word: 'Tiger', video: '/FSLAssetsVideos/EeveryDayWords/animals/Tiger.mp4', description: 'Tiger', category: 'Animals' },

  // Food & Drinks
  { word: 'Bread', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Bread.mp4', description: 'Bread', category: 'Food & Drinks' },
  { word: 'Coffee', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Coffee.mp4', description: 'Coffee', category: 'Food & Drinks' },
  { word: 'Egg', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Egg.mp4', description: 'Egg', category: 'Food & Drinks' },
  { word: 'Fish', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Fish.mp4', description: 'Fish', category: 'Food & Drinks' },
  { word: 'Fruit', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Fruit.mp4', description: 'Fruit', category: 'Food & Drinks' },
  { word: 'Meat', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Meat.mp4', description: 'Meat', category: 'Food & Drinks' },
  { word: 'Milk', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Milk.mp4', description: 'Milk', category: 'Food & Drinks' },
  { word: 'Rice', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Rice.mp4', description: 'Rice', category: 'Food & Drinks' },
  { word: 'Tea', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Tea.mp4', description: 'Tea', category: 'Food & Drinks' },
  { word: 'Vegetable', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Vegetable.mp4', description: 'Vegetable', category: 'Food & Drinks' },
  { word: 'Water', video: '/FSLAssetsVideos/EeveryDayWords/Food&Drinks/Water.mp4', description: 'Water', category: 'Food & Drinks' },

  // Emotions & Feelings
  { word: 'Afraid', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Afraid.mp4', description: 'Afraid', category: 'Emotions & Feelings' },
  { word: 'Angry', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Angry.mp4', description: 'Angry', category: 'Emotions & Feelings' },
  { word: 'Bored', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Bored.mp4', description: 'Bored', category: 'Emotions & Feelings' },
  { word: 'Excited', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Excited.mp4', description: 'Excited', category: 'Emotions & Feelings' },
  { word: 'Happy', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Happy.mp4', description: 'Happy', category: 'Emotions & Feelings' },
  { word: 'Hungry', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Hungry.mp4', description: 'Hungry', category: 'Emotions & Feelings' },
  { word: 'Sad', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Sad.mp4', description: 'Sad', category: 'Emotions & Feelings' },
  { word: 'Sick', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Sick.mp4', description: 'Sick', category: 'Emotions & Feelings' },
  { word: 'Thirsty', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Thirsty.mp4', description: 'Thirsty', category: 'Emotions & Feelings' },
  { word: 'Tired', video: '/FSLAssetsVideos/EeveryDayWords/Emotions&Feelings/Tired.mp4', description: 'Tired', category: 'Emotions & Feelings' },

  // Basic Actions
  { word: 'Close', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Close.mp4', description: 'Close', category: 'Basic Actions' },
  { word: 'Drink', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Drink.mp4', description: 'Drink', category: 'Basic Actions' },
  { word: 'Eat', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Eat.mp4', description: 'Eat', category: 'Basic Actions' },
  { word: 'Open', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Open.mp4', description: 'Open', category: 'Basic Actions' },
  { word: 'Read', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Read.mp4', description: 'Read', category: 'Basic Actions' },
  { word: 'Run', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Run.mp4', description: 'Run', category: 'Basic Actions' },
  { word: 'Sit', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Sit.mp4', description: 'Sit', category: 'Basic Actions' },
  { word: 'Sleep', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Sleep.mp4', description: 'Sleep', category: 'Basic Actions' },
  { word: 'Stand', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Stand.mp4', description: 'Stand', category: 'Basic Actions' },
  { word: 'Walk', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Walk.mp4', description: 'Walk', category: 'Basic Actions' },
  { word: 'Write', video: '/FSLAssetsVideos/EeveryDayWords/basicActions/Write.mp4', description: 'Write', category: 'Basic Actions' },

  // Question Words
  { word: 'How', video: '/FSLAssetsVideos/EeveryDayWords/questionWords/How.mp4', description: 'How', category: 'Question Words' },
  { word: 'What', video: '/FSLAssetsVideos/EeveryDayWords/questionWords/What.mp4', description: 'What', category: 'Question Words' },
  { word: 'When', video: '/FSLAssetsVideos/EeveryDayWords/questionWords/When.mp4', description: 'When', category: 'Question Words' },
  { word: 'Where', video: '/FSLAssetsVideos/EeveryDayWords/questionWords/Where.mp4', description: 'Where', category: 'Question Words' },
  { word: 'Which', video: '/FSLAssetsVideos/EeveryDayWords/questionWords/Which.mp4', description: 'Which', category: 'Question Words' },
  { word: 'Who', video: '/FSLAssetsVideos/EeveryDayWords/questionWords/Who.mp4', description: 'Who', category: 'Question Words' },
  { word: 'Whose', video: '/FSLAssetsVideos/EeveryDayWords/questionWords/Whose.mp4', description: 'Whose', category: 'Question Words' },
  { word: 'Why', video: '/FSLAssetsVideos/EeveryDayWords/questionWords/Why.mp4', description: 'Why', category: 'Question Words' },

  // Places
  { word: 'Bank', video: '/FSLAssetsVideos/EeveryDayWords/places/Bank.mp4', description: 'Bank', category: 'Places' },
  { word: 'Church', video: '/FSLAssetsVideos/EeveryDayWords/places/Church.mp4', description: 'Church', category: 'Places' },
  { word: 'Home', video: '/FSLAssetsVideos/EeveryDayWords/places/Home.mp4', description: 'Home', category: 'Places' },
  { word: 'Hospital', video: '/FSLAssetsVideos/EeveryDayWords/places/Hospital.mp4', description: 'Hospital', category: 'Places' },
  { word: 'Mall', video: '/FSLAssetsVideos/EeveryDayWords/places/Mall.mp4', description: 'Mall', category: 'Places' },
  { word: 'Market', video: '/FSLAssetsVideos/EeveryDayWords/places/Market.mp4', description: 'Market', category: 'Places' },
  { word: 'Park', video: '/FSLAssetsVideos/EeveryDayWords/places/Park.mp4', description: 'Park', category: 'Places' },
  { word: 'Restaurant', video: '/FSLAssetsVideos/EeveryDayWords/places/Restaurant.mp4', description: 'Restaurant', category: 'Places' },
  { word: 'School', video: '/FSLAssetsVideos/EeveryDayWords/places/School.mp4', description: 'School', category: 'Places' },
  { word: 'Store', video: '/FSLAssetsVideos/EeveryDayWords/places/Store.mp4', description: 'Store', category: 'Places' },

  // Time & Weather
  { word: 'Afternoon', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Afternoon.mp4', description: 'Afternoon', category: 'Time & Weather' },
  { word: 'Cold', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Cold.mp4', description: 'Cold', category: 'Time & Weather' },
  { word: 'Evening', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Evening.mp4', description: 'Evening', category: 'Time & Weather' },
  { word: 'Hot', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Hot.mp4', description: 'Hot', category: 'Time & Weather' },
  { word: 'Morning', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Morning.mp4', description: 'Morning', category: 'Time & Weather' },
  { word: 'Night', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Night.mp4', description: 'Night', category: 'Time & Weather' },
  { word: 'Rain', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Rain.mp4', description: 'Rain', category: 'Time & Weather' },
  { word: 'Snow', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Snow.mp4', description: 'Snow', category: 'Time & Weather' },
  { word: 'Sun', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Sun.mp4', description: 'Sun', category: 'Time & Weather' },
  { word: 'Wind', video: '/FSLAssetsVideos/EeveryDayWords/time&weather/Wind.mp4', description: 'Wind', category: 'Time & Weather' },

  // Body Parts
  { word: 'Arms', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Arms.mp4', description: 'Arms', category: 'Body Parts' },
  { word: 'Ears', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Ears.mp4', description: 'Ears', category: 'Body Parts' },
  { word: 'Eyes', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Eyes.mp4', description: 'Eyes', category: 'Body Parts' },
  { word: 'Feet', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Feet.mp4', description: 'Feet', category: 'Body Parts' },
  { word: 'Hands', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Hands.mp4', description: 'Hands', category: 'Body Parts' },
  { word: 'Head', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Head.mp4', description: 'Head', category: 'Body Parts' },
  { word: 'Legs', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Legs.mp4', description: 'Legs', category: 'Body Parts' },
  { word: 'Mouth', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Mouth.mp4', description: 'Mouth', category: 'Body Parts' },
  { word: 'Nose', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Nose.mp4', description: 'Nose', category: 'Body Parts' },
  { word: 'Stomach', video: '/FSLAssetsVideos/EeveryDayWords/bodyParts/Stomach.mp4', description: 'Stomach', category: 'Body Parts' },

  // Transportation & Directions
  { word: 'Airplane', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Airplane.mp4', description: 'Airplane', category: 'Transportation & Directions' },
  { word: 'Bicycle', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Bicycle.mp4', description: 'Bicycle', category: 'Transportation & Directions' },
  { word: 'Boat', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Boat.mp4', description: 'Boat', category: 'Transportation & Directions' },
  { word: 'Bus', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Bus.mp4', description: 'Bus', category: 'Transportation & Directions' },
  { word: 'Car', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Car.mp4', description: 'Car', category: 'Transportation & Directions' },
  { word: 'Go', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Go.mp4', description: 'Go', category: 'Transportation & Directions' },
  { word: 'Left', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Left.mp4', description: 'Left', category: 'Transportation & Directions' },
  { word: 'Right', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Right.mp4', description: 'Right', category: 'Transportation & Directions' },
  { word: 'Stop', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Stop.mp4', description: 'Stop', category: 'Transportation & Directions' },
  { word: 'Straight', video: '/FSLAssetsVideos/EeveryDayWords/transportation/Straight.mp4', description: 'Straight', category: 'Transportation & Directions' },

  // Pronouns
  { word: 'He', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/He.mp4', description: 'He', category: 'Pronouns' },
  { word: 'Her', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/Her.mp4', description: 'Her', category: 'Pronouns' },
  { word: 'Him', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/Him.mp4', description: 'Him', category: 'Pronouns' },
  { word: 'I', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/I.mp4', description: 'I', category: 'Pronouns' },
  { word: 'Me', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/Me.mp4', description: 'Me', category: 'Pronouns' },
  { word: 'She', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/She.mp4', description: 'She', category: 'Pronouns' },
  { word: 'Them', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/Them.mp4', description: 'Them', category: 'Pronouns' },
  { word: 'They', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/They.mp4', description: 'They', category: 'Pronouns' },
  { word: 'Us', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/Us.mp4', description: 'Us', category: 'Pronouns' },
  { word: 'We', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/We.mp4', description: 'We', category: 'Pronouns' },
  { word: 'You', video: '/FSLAssetsVideos/AdditionalBasics/pronouns/You.mp4', description: 'You', category: 'Pronouns' },

  // Common Verbs
  { word: 'Bring', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Bring.mp4', description: 'Bring', category: 'Common Verbs' },
  { word: 'Buy', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Buy.mp4', description: 'Buy', category: 'Common Verbs' },
  { word: 'Call', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Call.mp4', description: 'Call', category: 'Common Verbs' },
  { word: 'Give', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Give.mp4', description: 'Give', category: 'Common Verbs' },
  { word: 'Have', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Have.mp4', description: 'Have', category: 'Common Verbs' },
  { word: 'Need', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Need.mp4', description: 'Need', category: 'Common Verbs' },
  { word: 'Sell', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Sell.mp4', description: 'Sell', category: 'Common Verbs' },
  { word: 'Take', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Take.mp4', description: 'Take', category: 'Common Verbs' },
  { word: 'Wait', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Wait.mp4', description: 'Wait', category: 'Common Verbs' },
  { word: 'Want', video: '/FSLAssetsVideos/AdditionalBasics/commonVerbs/Want.mp4', description: 'Want', category: 'Common Verbs' },

  // Opposites
  { word: 'Big-Small', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Big-Small.mp4', description: 'Big-Small', category: 'Opposites' },
  { word: 'Fast-Slow', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Fast-Slow.mp4', description: 'Fast-Slow', category: 'Opposites' },
  { word: 'Hard-Soft', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Hard-Soft.mp4', description: 'Hard-Soft', category: 'Opposites' },
  { word: 'Hot-Cold', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Hot-Cold.mp4', description: 'Hot-Cold', category: 'Opposites' },
  { word: 'Light-Dark', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Light-Dark.mp4', description: 'Light-Dark', category: 'Opposites' },
  { word: 'Near-Far', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Near-Far.mp4', description: 'Near-Far', category: 'Opposites' },
  { word: 'Old-Young', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Old-Young.mp4', description: 'Old-Young', category: 'Opposites' },
  { word: 'Open-Close', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Open-Close.mp4', description: 'Open-Close', category: 'Opposites' },
  { word: 'Thick-Thin', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Thick-Thin.mp4', description: 'Thick-Thin', category: 'Opposites' },
  { word: 'Up-Down', video: '/FSLAssetsVideos/AdditionalBasics/opposites/Up-Down.mp4', description: 'Up-Down', category: 'Opposites' },

  // Shapes & Sizes
  { word: 'Circle', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Circle.mp4', description: 'Circle', category: 'Shapes & Sizes' },
  { word: 'Deep', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Deep.mp4', description: 'Deep', category: 'Shapes & Sizes' },
  { word: 'Long', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Long.mp4', description: 'Long', category: 'Shapes & Sizes' },
  { word: 'Narrow', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Narrow.mp4', description: 'Narrow', category: 'Shapes & Sizes' },
  { word: 'Rectangle', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Rectangle.mp4', description: 'Rectangle', category: 'Shapes & Sizes' },
  { word: 'Short', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Short.mp4', description: 'Short', category: 'Shapes & Sizes' },
  { word: 'Square', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Square.mp4', description: 'Square', category: 'Shapes & Sizes' },
  { word: 'Tall', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Tall.mp4', description: 'Tall', category: 'Shapes & Sizes' },
  { word: 'Triangle', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Triangle.mp4', description: 'Triangle', category: 'Shapes & Sizes' },
  { word: 'Wide', video: '/FSLAssetsVideos/AdditionalBasics/shapeAndSizes/Wide.mp4', description: 'Wide', category: 'Shapes & Sizes' },

  // Common Household Items
  { word: 'Blanket', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Blanket.mp4', description: 'Blanket', category: 'Common Household Items' },
  { word: 'Cup', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Cup.mp4', description: 'Cup', category: 'Common Household Items' },
  { word: 'Fork', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Fork.mp4', description: 'Fork', category: 'Common Household Items' },
  { word: 'Pan', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Pan.mp4', description: 'Pan', category: 'Common Household Items' },
  { word: 'Pillow', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Pillow.mp4', description: 'Pillow', category: 'Common Household Items' },
  { word: 'Plate', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Plate.mp4', description: 'Plate', category: 'Common Household Items' },
  { word: 'Pot', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Pot.mp4', description: 'Pot', category: 'Common Household Items' },
  { word: 'Soap', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Soap.mp4', description: 'Soap', category: 'Common Household Items' },
  { word: 'Spoon', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Spoon.mp4', description: 'Spoon', category: 'Common Household Items' },
  { word: 'Towel', video: '/FSLAssetsVideos/AdditionalBasics/commonHouseholdItems/Towel.mp4', description: 'Towel', category: 'Common Household Items' },

  // Modes of Communication
  { word: 'Call', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Call.mp4', description: 'Call', category: 'Modes of Communication' },
  { word: 'Email', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Email.mp4', description: 'Email', category: 'Modes of Communication' },
  { word: 'Listen', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Listen.mp4', description: 'Listen', category: 'Modes of Communication' },
  { word: 'Message', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Message.mp4', description: 'Message', category: 'Modes of Communication' },
  { word: 'Read', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Read.mp4', description: 'Read', category: 'Modes of Communication' },
  { word: 'Sign', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Sign.mp4', description: 'Sign', category: 'Modes of Communication' },
  { word: 'Talk', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Talk.mp4', description: 'Talk', category: 'Modes of Communication' },
  { word: 'Text', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Text.mp4', description: 'Text', category: 'Modes of Communication' },
  { word: 'Watch', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Watch.mp4', description: 'Watch', category: 'Modes of Communication' },
  { word: 'Write', video: '/FSLAssetsVideos/AdditionalBasics/modesOfCommunication/Write.mp4', description: 'Write', category: 'Modes of Communication' },

  // Clothing & Accessories
  { word: 'Bag', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Bag.mp4', description: 'Bag', category: 'Clothing & Accessories' },
  { word: 'Dress', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Dress.mp4', description: 'Dress', category: 'Clothing & Accessories' },
  { word: 'Glasses', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Glasses.mp4', description: 'Glasses', category: 'Clothing & Accessories' },
  { word: 'Hat', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Hat.mp4', description: 'Hat', category: 'Clothing & Accessories' },
  { word: 'Jacket', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Jacket.mp4', description: 'Jacket', category: 'Clothing & Accessories' },
  { word: 'Pants', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Pants.mp4', description: 'Pants', category: 'Clothing & Accessories' },
  { word: 'Ring', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Ring.mp4', description: 'Ring', category: 'Clothing & Accessories' },
  { word: 'Shirt', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Shirt.mp4', description: 'Shirt', category: 'Clothing & Accessories' },
  { word: 'Shoes', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Shoes.mp4', description: 'Shoes', category: 'Clothing & Accessories' },
  { word: 'Socks', video: '/FSLAssetsVideos/AdditionalBasics/clothingAndAccessories/Socks.mp4', description: 'Socks', category: 'Clothing & Accessories' },

  // Modes of Payment
  { word: 'Buy', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Buy.mp4', description: 'Buy', category: 'Modes of Payment' },
  { word: 'Card', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Card.mp4', description: 'Card', category: 'Modes of Payment' },
  { word: 'Cash', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Cash.mp4', description: 'Cash', category: 'Modes of Payment' },
  { word: 'Charge', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Charge.mp4', description: 'Charge', category: 'Modes of Payment' },
  { word: 'Cheap', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Cheap.mp4', description: 'Cheap', category: 'Modes of Payment' },
  { word: 'Coins', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Coins.mp4', description: 'Coins', category: 'Modes of Payment' },
  { word: 'Expensive', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Expensive.mp4', description: 'Expensive', category: 'Modes of Payment' },
  { word: 'Pay', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Pay.mp4', description: 'Pay', category: 'Modes of Payment' },
  { word: 'Sell', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Sell.mp4', description: 'Sell', category: 'Modes of Payment' },
  { word: 'Wallet', video: '/FSLAssetsVideos/AdditionalBasics/modesOfPayment/Wallet.mp4', description: 'Wallet', category: 'Modes of Payment' },

  // Social Relationships
  { word: 'Family', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/Family.mp4', description: 'Family', category: 'Social Relationships' },
  { word: 'Friend', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/Friend.mp4', description: 'Friend', category: 'Social Relationships' },
  { word: 'Help', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/Help.mp4', description: 'Help', category: 'Social Relationships' },
  { word: 'Love', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/Love.mp4', description: 'Love', category: 'Social Relationships' },
  { word: 'No', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/No.mp4', description: 'No', category: 'Social Relationships' },
  { word: 'Please', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/Please.mp4', description: 'Please', category: 'Social Relationships' },
  { word: 'Respect', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/Respect.mp4', description: 'Respect', category: 'Social Relationships' },
  { word: 'Sorry', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/Sorry.mp4', description: 'Sorry', category: 'Social Relationships' },
  { word: 'Thank You', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/Thankyou.mp4', description: 'Thank You', category: 'Social Relationships' },
  { word: 'Yes', video: '/FSLAssetsVideos/AdditionalBasics/socialRelationship/Yes.mp4', description: 'Yes', category: 'Social Relationships' },

  // Emergency Signs
  { word: 'Call', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Call.mp4', description: 'Call', category: 'Emergency Signs' },
  { word: 'Danger', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Danger.mp4', description: 'Danger', category: 'Emergency Signs' },
  { word: 'Doctor', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Doctor.mp4', description: 'Doctor', category: 'Emergency Signs' },
  { word: 'Fire', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Fire.mp4', description: 'Fire', category: 'Emergency Signs' },
  { word: 'Go', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Go.mp4', description: 'Go', category: 'Emergency Signs' },
  { word: 'Help', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Helpvt.mp4', description: 'Help', category: 'Emergency Signs' },
  { word: 'Hospital', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Hospitalvt.mp4', description: 'Hospital', category: 'Emergency Signs' },
  { word: 'Police', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Police.mp4', description: 'Police', category: 'Emergency Signs' },
  { word: 'Run', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Run.mp4', description: 'Run', category: 'Emergency Signs' },
  { word: 'Stop', video: '/FSLAssetsVideos/AdditionalBasics/EmergencySigns/Stop.mp4', description: 'Stop', category: 'Emergency Signs' },

  // Prepositions & Locations
  { word: 'Above', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Above.mp4', description: 'Above', category: 'Prepositions & Locations' },
  { word: 'Behind', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Behind.mp4', description: 'Behind', category: 'Prepositions & Locations' },
  { word: 'Below', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Below.mp4', description: 'Below', category: 'Prepositions & Locations' },
  { word: 'Beside', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Beside.mp4', description: 'Beside', category: 'Prepositions & Locations' },
  { word: 'Between', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Between.mp4', description: 'Between', category: 'Prepositions & Locations' },
  { word: 'Far', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Far.mp4', description: 'Far', category: 'Prepositions & Locations' },
  { word: 'In Front', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Infront.mp4', description: 'In Front', category: 'Prepositions & Locations' },
  { word: 'Inside', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Inside.mp4', description: 'Inside', category: 'Prepositions & Locations' },
  { word: 'Near', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Near.mp4', description: 'Near', category: 'Prepositions & Locations' },
  { word: 'Outside', video: '/FSLAssetsVideos/AdditionalBasics/prepositionsAndLocation/Outside.mp4', description: 'Outside', category: 'Prepositions & Locations' },

  // Basic Commands
  { word: 'Come', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Come.mp4', description: 'Come', category: 'Basic Commands' },
  { word: 'Follow', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Follow.mp4', description: 'Follow', category: 'Basic Commands' },
  { word: 'Go', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Govt.mp4', description: 'Go', category: 'Basic Commands' },
  { word: 'Listen', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Listenvt.mp4', description: 'Listen', category: 'Basic Commands' },
  { word: 'Look', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Look.mp4', description: 'Look', category: 'Basic Commands' },
  { word: 'Sit', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Sit.mp4', description: 'Sit', category: 'Basic Commands' },
  { word: 'Stand', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Stand.mp4', description: 'Stand', category: 'Basic Commands' },
  { word: 'Stay', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Stay.mp4', description: 'Stay', category: 'Basic Commands' },
  { word: 'Stop', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Stop.mp4', description: 'Stop', category: 'Basic Commands' },
  { word: 'Wait', video: '/FSLAssetsVideos/AdditionalBasics/basicCommands/Wait.mp4', description: 'Wait', category: 'Basic Commands' },
];

// Add at the top of the component, after dictionaryData:
const allCategories = Array.from(new Set(dictionaryData.map(entry => entry.category)));

const Dictionary = () => {
  const { t } = useTranslation(); // t(key): returns translation or falls back to English
  const { language } = useLanguage();
  // State for search input and dropdown visibility
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [speedStates, setSpeedStates] = useState({ slow: false, slower: false, slowest: false });
  const videoRef = useRef(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter words based on search input
  // t(`dictionary.${entry.word}.title`) will return the Filipino translation if available, otherwise the English word
  const filteredWords = dictionaryData.filter(entry => {
    const translated = t(`dictionary.${entry.word}.title`) || '';
    return (
      entry.word.toLowerCase().includes(search.toLowerCase()) ||
      translated.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Group filtered words by category
  // t(`dictionary.categories.${category}`) will return the Filipino category name if available, otherwise the English name
  const groupedByCategory = filteredWords.reduce((acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = [];
    acc[entry.category].push(entry);
    return acc;
  }, {});

  // Always show dropdown as user types, except when clicking outside
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      setShowDropdown(true);
    }
  }, [search]);

  // Handle selecting a word from the dropdown
  const handleSelect = (word) => {
    setSearch(word);
    setSelectedWord(dictionaryData.find(entry => entry.word === word));
    setShowDropdown(false);
  };

  // Handle search submit (Enter key)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredWords.length > 0) {
      handleSelect(filteredWords[0].word);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Hide word details if search does not match any word
  useEffect(() => {
    if (
      search.trim() !== '' &&
      !filteredWords.some(entry => entry.word.toLowerCase() === search.toLowerCase())
    ) {
      setSelectedWord(null);
    }
  }, [search, filteredWords]);

  // Handle speed button click
  const handleSpeedClick = (speedType) => {
    if (!videoRef.current) return;
    const speeds = { slow: 0.5, slower: 0.25, slowest: 0.1 };
    const newSpeedStates = { slow: false, slower: false, slowest: false };
    if (speedStates[speedType]) {
      videoRef.current.playbackRate = 1.0;
    } else {
      newSpeedStates[speedType] = true;
      videoRef.current.playbackRate = speeds[speedType];
    }
    setSpeedStates(newSpeedStates);
  };

  // Reset speed when a new word is selected
  useEffect(() => {
    setSpeedStates({ slow: false, slower: false, slowest: false });
    if (videoRef.current) videoRef.current.playbackRate = 1.0;
  }, [selectedWord]);

  // Add a handler for category selection:
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
    setSelectedWord(null);
    setSearch('');
  };

  // Filter words for the selected category:
  const categoryWords = selectedCategory
    ? dictionaryData.filter(entry => entry.category === selectedCategory)
    : [];

  // When displaying a word or category, always use t() for translation with fallback
  let translatedDescription = '';
  let translatedCategory = '';
  let translatedWord = '';
  if (selectedWord) {
    // Description: fallback to English if translation missing
    translatedDescription = t(`dictionary.${selectedWord.word}.description`) || selectedWord.description;
    // Category: fallback to English if translation missing
    translatedCategory = t(`dictionary.categories.${selectedWord.category}`) || selectedWord.category;
    // Word: fallback to English if translation missing
    translatedWord = t(`dictionary.${selectedWord.word}.title`) || selectedWord.word;
  }

  return (
    <div className="dictionary-main-container">
      <h1 className="dictionary-title">Dictionary</h1>
      <p className="dictionary-sub">Search and learn Filipino Sign Language</p>
      {/* Search bar with dropdown */}
      <div className="dictionary-search-row">
        <div className="dictionary-searchbar-wrapper">
          <input
            ref={inputRef}
            className="dictionary-searchbar"
            type="text"
            placeholder="Search for a word..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
          />
          {showDropdown && (
            <div ref={dropdownRef} className="dictionary-dropdown">
              {filteredWords.length === 0 ? (
                <div className="dictionary-dropdown-item dictionary-dropdown-empty">No words found</div>
              ) : (
                Object.entries(groupedByCategory).map(([category, entries]) => [
                  // Category section in dropdown: uses t() for Filipino translation, falls back to English if not found
                  <div key={category} className="dictionary-dropdown-section">{t(`dictionary.categories.${category}`) || category}</div>,
                  entries.map(entry => (
                    <div
                      key={entry.word}
                      className={`dictionary-dropdown-item${hoveredItem === entry.word ? ' dictionary-dropdown-item-hover' : ''}`}
                      onClick={() => handleSelect(entry.word)}
                      onMouseDown={e => e.preventDefault()}
                      onMouseEnter={() => setHoveredItem(entry.word)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Dropdown word: uses t() for Filipino translation, falls back to English if not found */}
                      {t(`dictionary.${entry.word}.title`) || entry.word}
                    </div>
                  ))
                ])
              )}
            </div>
          )}
        </div>
        <div className="dictionary-category-btn-wrapper">
          <button
            className="dictionary-category-btn"
            onClick={() => setCategoryDropdownOpen(v => !v)}
          >
            {/* Category button: uses t() for Filipino translation, falls back to English if not found */}
            {selectedCategory ? (t(`dictionary.categories.${selectedCategory}`) || selectedCategory) : 'Categories'} ▼
          </button>
          {categoryDropdownOpen && (
            <div className="dictionary-category-dropdown">
              <div
                key="none"
                className="dictionary-category-dropdown-item"
                onClick={() => handleCategorySelect(null)}
              >
                None
              </div>
              {allCategories.map(category => (
                <div
                  key={category}
                  className="dictionary-category-dropdown-item"
                  onClick={() => handleCategorySelect(category)}
                >
                  {/* Category dropdown item: uses t() for Filipino translation, falls back to English if not found */}
                  {t(`dictionary.categories.${category}`) || category}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Word details: video and description */}
      <div className="dictionary-word-card">
        {selectedCategory && !selectedWord && (
          <div className="dictionary-category-words">
            {/* Category title: uses t() for Filipino translation, falls back to English if not found */}
            <h2 className="dictionary-category-title">{t(`dictionary.categories.${selectedCategory}`) || selectedCategory}</h2>
            <div className="dictionary-category-words-list">
              {categoryWords.map(entry => (
                <button
                  key={entry.word}
                  className="dictionary-category-word-btn"
                  onClick={() => handleSelect(entry.word)}
                >
                  {/* Word button: uses t() for Filipino translation, falls back to English if not found */}
                  {t(`dictionary.${entry.word}.title`) || entry.word}
                </button>
              ))}
            </div>
          </div>
        )}
        {search.trim() !== '' && selectedWord ? (
          <div className="dictionary-video-container">
            <h2 className="dictionary-word-title">{translatedWord}</h2>
            <video
              ref={videoRef}
              src={selectedWord.video}
              className="dictionary-video"
              muted
              loop
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <div className="dictionary-speed-btns">
              <button
                className={`dictionary-speed-btn${speedStates.slow ? ' active' : ''}`}
                onClick={() => handleSpeedClick('slow')}
              >
                -1
              </button>
              <button
                className={`dictionary-speed-btn${speedStates.slower ? ' active' : ''}`}
                onClick={() => handleSpeedClick('slower')}
              >
                -2
              </button>
              <button
                className={`dictionary-speed-btn${speedStates.slowest ? ' active' : ''}`}
                onClick={() => handleSpeedClick('slowest')}
              >
                -3
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <style>{`
        .dictionary-main-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          background: transparent;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        .dictionary-title {
          color: #fff;
          font-weight: 900;
          font-size: 3rem;
          margin-top: 0;
          margin-bottom: 1rem;
          text-align: center;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(102, 126, 234, 0.5);
          background: linear-gradient(45deg, #fff, #f093fb, #667eea);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 2px;
        }
        .dictionary-sub {
          color: #ffe0fa;
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 2rem;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          opacity: 0.9;
        }
        @media (max-width: 700px) {
          .dictionary-main-container {
            width: 100% !important;
            max-width: 100% !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .dictionary-search-row {
            flex-direction: column !important;
            gap: 0.7rem !important;
            width: 100% !important;
            align-items: stretch !important;
          }
          .dictionary-searchbar-wrapper,
          .dictionary-category-btn-wrapper {
            width: 100% !important;
            min-width: 0 !important;
          }
          .dictionary-searchbar,
          .dictionary-category-btn {
            width: 100% !important;
            min-width: 0 !important;
            font-size: 0.98rem !important;
            padding: 0.7rem 1rem !important;
          }
          .dictionary-dropdown,
          .dictionary-category-dropdown {
            min-width: 100% !important;
            left: 0 !important;
            right: 0 !important;
          }
          .dictionary-word-card {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            padding: 0.7rem 0.2rem 1rem 0.2rem !important;
            border-radius: 1rem !important;
            margin-top: 3.5rem !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            box-sizing: border-box !important;
          }
          .dictionary-word-card h2 {
            font-size: 1.08rem !important;
            margin-bottom: 0.7rem !important;
          }
          .dictionary-video-container h2 {
            font-size: 1.2rem !important;
          }
        }
        @media (min-width: 701px) {
          .dictionary-main-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            min-height: 100vh;
            max-width: 1200px;
            margin: 0 auto;
          }
          .dictionary-search-row {
            justify-content: center;
          }
        }
        .dictionary-video-container h2 {
          text-align: center !important;
          width: 100%;
        }
        .dictionary-search-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .dictionary-searchbar-wrapper {
          position: relative;
          width: 300px;
        }
        .dictionary-searchbar {
          width: 300px;
          padding: 1rem 1.5rem;
          border-radius: 1.5rem;
          border: 2px solid rgba(102, 126, 234, 0.3);
          font-size: 1.1rem;
          outline: none;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
        }
        .dictionary-searchbar::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .dictionary-searchbar:focus {
          border: 2px solid rgba(102, 126, 234, 0.6);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
          background: rgba(255, 255, 255, 0.15);
        }
        .dictionary-dropdown {
          width: 300px;
          max-height: 300px;
          overflow-y: auto;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 0 0 1.5rem 1.5rem;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: absolute;
          z-index: 10;
          left: 0;
          top: 100%;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .dictionary-dropdown-section {
          padding: 0.8rem 1.2rem 0.4rem 1.2rem;
          color: #fff;
          font-weight: 800;
          font-size: 1rem;
          background: linear-gradient(135deg, rgba(240, 147, 251, 0.8) 0%, rgba(102, 126, 234, 0.8) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          margin-top: 0.5rem;
          letter-spacing: 0.5px;
          border-radius: 0.8rem 0.8rem 0 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .dictionary-dropdown-item {
          padding: 0.8rem 1.2rem;
          cursor: pointer;
          font-size: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: #fff;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .dictionary-dropdown-item-hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .dictionary-dropdown-empty {
          color: #aaa;
          cursor: default;
        }
        .dictionary-category-btn-wrapper {
          position: relative;
        }
        .dictionary-category-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 1.2rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%);
          color: white;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .dictionary-category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .dictionary-category-dropdown {
          position: absolute;
          top: 110%;
          right: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          z-index: 10;
          min-width: 200px;
          padding: 0.5rem 0;
          max-height: 300px;
          overflow-y: auto;
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .dictionary-category-dropdown-item {
          padding: 0.8rem 1.2rem;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          background: transparent;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .dictionary-category-dropdown-item.selected,
        .dictionary-category-dropdown-item:hover {
          color: #fff;
          font-weight: 700;
          background: linear-gradient(135deg, rgba(240, 147, 251, 0.8) 0%, rgba(102, 126, 234, 0.8) 100%);
          transform: translateX(4px);
        }
        .dictionary-word-card {
          margin-top: 2rem;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 50%, rgba(240, 147, 251, 0.15) 100%);
          border-radius: 2rem;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          padding: 2.5rem 2rem;
          min-width: 280px;
          max-width: 480px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          min-height: 300px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .dictionary-category-words {
          width: 100%;
        }
        .dictionary-category-title {
          color: #fff;
          font-weight: 800;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          background: linear-gradient(45deg, #fff, #f093fb, #667eea);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dictionary-category-words-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          justify-content: center;
        }
        .dictionary-category-word-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          padding: 0.8rem 1.2rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .dictionary-category-word-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .dictionary-video-container {
          width: 100%;
        }
        .dictionary-word-title {
          margin: 0.5rem 0 1rem 0;
          color: white;
          font-weight: 800;
          font-size: 2.2rem;
          text-shadow: 0 2px 8px rgba(58, 35, 115, 0.18);
        }
        .dictionary-video {
          max-width: 100%;
          width: 100%;
          height: auto;
          border-radius: 1.5rem;
          margin-bottom: 1.5rem;
          background: #000;
          object-fit: cover;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(102, 126, 234, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .dictionary-speed-btns {
          display: flex;
          justify-content: center;
          gap: 1.2rem;
          margin-top: 1.5rem;
        }
        .dictionary-speed-btn {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          color: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.2);
          padding: 0.8rem 1.5rem;
          border-radius: 1rem;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .dictionary-speed-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%);
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .dictionary-speed-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Unified Animation System - Only for non-interactive elements */
        .dictionary-title {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }

        .dictionary-sub {
          opacity: 0;
          animation: fadeIn 1s ease-out 0.2s forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Dictionary;