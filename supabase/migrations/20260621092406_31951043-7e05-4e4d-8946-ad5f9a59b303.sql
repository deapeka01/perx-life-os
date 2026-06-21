
UPDATE public.offers SET image_url = CASE title
  WHEN '10-Class Pack' THEN '/__l5e/assets-v1/de98a1fe-086f-4037-b092-f79c5a5c3ea0/yoga.jpg'
  WHEN '3-Course Organic Dinner' THEN '/__l5e/assets-v1/b20243b9-4512-48c6-a69b-ba188571d936/dinner.jpg'
  WHEN 'All-Day Pass + Coffee' THEN '/__l5e/assets-v1/fb847c02-307b-4c4d-8c6d-f1a6758e85bc/coworking-coffee.jpg'
  WHEN 'Applied AI Bootcamp' THEN '/__l5e/assets-v1/7029fb2c-7e66-437c-bbf8-34e9f1dfd10a/ai-lab.jpg'
  WHEN 'Chef''s Table for 2' THEN '/__l5e/assets-v1/b20243b9-4512-48c6-a69b-ba188571d936/dinner.jpg'
  WHEN 'Couples Recovery' THEN '/__l5e/assets-v1/319809d4-57ff-421d-8af7-fc7c8bb61615/spa.jpg'
  WHEN 'Jazz Night + Wine' THEN '/__l5e/assets-v1/ea33a863-c111-4f92-ace4-09969e8f9f90/jazz.jpg'
  WHEN 'Mediterranean Cooking Class' THEN '/__l5e/assets-v1/b936c9a0-3ffe-4f40-98a6-6f105d1530ca/cooking.jpg'
  WHEN 'Monthly Hot Desk' THEN '/__l5e/assets-v1/fb847c02-307b-4c4d-8c6d-f1a6758e85bc/coworking-coffee.jpg'
  WHEN 'Pottery Masterclass' THEN '/__l5e/assets-v1/c83a743a-b5f2-455b-bd1d-dd5da2c52ce8/pottery.jpg'
  WHEN 'Prompt Engineering Lab' THEN '/__l5e/assets-v1/7029fb2c-7e66-437c-bbf8-34e9f1dfd10a/ai-lab.jpg'
  WHEN 'Riviera Day Trip' THEN '/__l5e/assets-v1/90b119b0-bceb-4721-82d7-834759ea2a79/riviera.jpg'
  WHEN 'Rooftop Brunch for 2' THEN '/__l5e/assets-v1/11a56297-7dcf-4c3b-b5c0-cbf619e76089/brunch.jpg'
  WHEN 'Sunrise Hike' THEN '/__l5e/assets-v1/120fb406-6a70-4cdd-bb2a-328e1a276bda/theth.jpg'
  WHEN 'Sunset Cable Car + Dinner' THEN '/__l5e/assets-v1/63ebb8d1-e6f9-4d04-b6cd-9357c3535c01/dajti.jpg'
  WHEN 'Thermal Spa Day' THEN '/__l5e/assets-v1/319809d4-57ff-421d-8af7-fc7c8bb61615/spa.jpg'
  WHEN 'Vinyasa Class' THEN '/__l5e/assets-v1/de98a1fe-086f-4037-b092-f79c5a5c3ea0/yoga.jpg'
  WHEN 'Weekend Alpine Trip' THEN '/__l5e/assets-v1/120fb406-6a70-4cdd-bb2a-328e1a276bda/theth.jpg'
  ELSE image_url
END
WHERE image_url IS NULL;
