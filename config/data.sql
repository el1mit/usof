USE usof;

INSERT INTO users (login, password, full_name, email, rating, role, activated) VALUES 
    ('admin', '$2a$12$3SIF96cucuJ8Io/VzBWGauBaEL.lnbJBX0Ga3mbCiyZjQZ4i8BgZi', 'Felix Canader', 'pabac52378@civikli.com', 999, 'ADMIN', 1),
    ('operym', '$2a$12$nkMfwVqmTbKG9S4p3Spt8OqjBF.GUN5Le0xHHw9DO69wCTMNCcXK.', 'Olexander Erymon', 'xilag46581@canyona.com', 96, 'USER', 1),
    ('dnisov', '$2a$12$Df1WeRq0vaNijEbPE1gLz.Lr.99t.wPmJCLmJ7FVJVzzCt3Lvuvae', 'Demin Sovap', 'yotic77130@civikli.com', 42, 'USER', 1),
    ('realadmin', '$2a$12$/kwuDbpZYjf2VfaETYd4v.iudAd2.vUqkDDBxj4sqHFKOrHYdLCeW', 'Jim Leron', 'lowovoy237@botsoko.com', 999, 'ADMIN', 1),
    ('karen', '$2a$12$ROOtv6lBKWgSk5Lz55hbYuto.80qVxLcQpPIBSCS.LiCR9R9rlsYe', 'Felix Canader', 'vevig21678@botsoko.com', 15, 'USER', 1),
    ('pokege', '$2a$12$uu1fhuxBtl8A8lB.EPtwk.6om7pyyZ3gcCh23uMbFge8WCQ8C0G3W', 'Felix Canader', 'yanoha9233@civikli.com', 999, 'USER', 1);

INSERT INTO categories (title, description) VALUES
    ('JS', 'For questions regarding programming in ECMAScript (JavaScript/JS) and its various dialects/implementations (excluding ActionScript).'),
    ('HTML', 'HTML (HyperText Markup Language) is the markup language for creating web pages and other information to be displayed in a web browser. Questions regarding HTML should include a minimal reproducible example and some idea of what youre trying to achieve.'),
    ('CSS', 'CSS (Cascading Style Sheets) is a representation style sheet language used for describing the look and formatting of HTML (HyperText Markup Language), XML (Extensible Markup Language) documents and SVG elements including (but not limited to) colors, layout, fonts, and animations.'),
    ('C', 'C is a general-purpose programming language used for system programming (OS and embedded), libraries, games and cross-platform. This tag should be used with general questions concerning the C language, as defined in the ISO 9899 standard (the latest version, 9899:2018, unless otherwise specified — also tag version-specific requests with c89, c99, c11, etc).'),
    ('C++', 'C++ is a general-purpose programming language. It was originally designed as an extension to C and has a similar syntax, but it is now a completely different language. Use this tag for questions about code (to be) compiled with a C++ compiler.'),
    ('C#', 'C# (pronounced "see sharp") is a high level, statically typed, multi-paradigm programming language developed by Microsoft. C# code usually targets Microsofts .NET family of tools and run-times, which include .NET, .NET Framework and Xamarin among others.'),
    ('Java', 'Java is a high-level object-oriented programming language. Use this tag when youre having problems using or understanding the language itself. This tag is frequently used alongside other tags for libraries and/or frameworks used by Java developers.'),
    ('Design Patterns', 'A design pattern is a general reusable solution to a commonly occurring problem in software design. Use this tag for questions when youre having problems with the implementation of design-patterns.');

INSERT INTO posts (author_id, title, publish_date, content) VALUES
    (2,'React: how to force state changes to take place after setState','2022-08-20','How to force the state update to take place in React after calling setState? As far as I know, state is effectively updated when render is called next time.'),
    (4,'How to send same video resolution every time in WebRTC','2021-05-12','How to send video resolution 640x480 every time and in every device in webrtc ? im using following code.'),
    (3,'VS Code: order of Java project elements','2019-12-06','How can I sort the elements of my java projects in VS Code ? I already use the extension "Project Manager for Java" from Microsoft.'),
    (2,'Cant assign animation for each element','2022-09-10','I need to assign each (slideInLeft) animation to the "Hello" message each time I click the button and it shows up. But every time i press the button, it repeats the effect for all.'),
    (5,'custom horizontal scroll the list of images in div','2022-08-21','I dont want the scroll bar at bottom. I also dont need scrolls. My expected output was this.'),
    (6,'Decay std::array to pointer','2022-08-20','In C++20 I can use std::span, but currently I want to avoid it as well. Any easy way to define some operator that will be able to convert / cast, but only inside the class?');

INSERT INTO comments (author_id, publish_date, content, post_id) VALUES
    (4, '2022-08-23', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed sapien posuere enim bibendum iaculis. Curabitur vel lorem sagittis, placerat libero et, maximus turpis. Donec dignissim, turpis vel pretium facilisis, leo arcu lacinia diam, id feugiat sapien nulla tempus risus. Cras dignissim non quam id scelerisque', 1),
    (5, '2022-08-23', 'Nunc rhoncus varius placerat. Vivamus sed metus lacinia, elementum mauris quis, dignissim elit. Praesent ut tellus quis arcu posuere mollis sit amet a lorem. In hac habitasse platea dictumst. Sed varius, quam vel varius rutrum, turpis erat mollis elit, vitae pellentesque odio eros a elit.', 1),
    (1, '2019-12-12', 'Sed vulputate nisi a porttitor placerat. Integer aliquam, elit ut auctor malesuada, nibh lectus tempus nisl, quis suscipit tortor tellus vitae enim.', 3),
    (3, '2022-09-18', 'Donec commodo scelerisque laoreet. Nunc pretium orci id eros pretium, quis ultrices leo placerat. Sed sit amet felis volutpat, laoreet lacus id, posuere massa. Etiam facilisis a risus nec aliquam.', 4),
    (5, '2021-05-23', 'Aliquam erat volutpat. Suspendisse sagittis tempus semper. Suspendisse hendrerit rutrum lectus sed egestas. Proin at sapien id ante ullamcorper elementum.', 2),
    (4, '2019-12-17', 'Ut mattis, mi id luctus sodales, arcu enim cursus nisl, vitae placerat quam massa quis augue. Nunc at velit erat. Donec pharetra commodo sagittis.', 3),
    (6, '2022-08-27', 'Suspendisse convallis nisi et porta tempor. Quisque quis sapien sed turpis elementum lobortis. Vestibulum non felis augue. Nulla facilisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', 5),
    (6, '2020-01-04', 'Nulla tellus dolor, elementum sed risus placerat, tincidunt rutrum lectus. Nullam consequat enim nec sagittis vehicula. Aenean mattis arcu felis, sed molestie massa viverra non. Ut risus nisl, maximus non commodo vitae, porta non nibh.', 3);

INSERT INTO post_categories (post_id, category_id) VALUES
    (1, 8), (1, 2), (1, 3),
    (2, 1), (2, 2), (2, 3),
    (3, 7),
    (4, 3), (4, 2), (4, 1),
    (5, 1), (5, 2), (5, 3),
    (6, 5), (6, 4);

INSERT INTO posts_likes (author_id, publish_date, post_id, type) VALUES
    (1, '2022-09-25', 1, 1),
    (1, '2022-09-25', 2, 0),
    (1, '2022-09-25', 3, 1),
    (2, '2022-09-25', 1, 0),
    (2, '2022-09-25', 5, 1),
    (3, '2022-09-25', 1, 1),
    (4, '2022-09-25', 4, 0),
    (2, '2022-09-25', 3, 1),
    (3, '2022-09-25', 2, 0),
    (4, '2022-09-25', 5, 0),
    (5, '2022-09-25', 1, 1),
    (4, '2022-09-25', 1, 1),
    (6, '2022-09-25', 1, 1);

INSERT INTO comments_likes (author_id, publish_date, comment_id, type) VALUES    
    (1, '2022-09-25', 1, 1),
    (1, '2022-09-25', 2, 0),
    (1, '2022-09-25', 3, 1),
    (2, '2022-09-25', 1, 0),
    (2, '2022-09-25', 5, 1),
    (3, '2022-09-25', 1, 1),
    (4, '2022-09-25', 4, 0),
    (2, '2022-09-25', 3, 1),
    (3, '2022-09-25', 2, 0),
    (4, '2022-09-25', 5, 0),
    (5, '2022-09-25', 1, 1),
    (4, '2022-09-25', 1, 1),
    (6, '2022-09-25', 1, 1);