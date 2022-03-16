import React from 'react';
import styled, { StyledComponent } from 'styled-components';

const siteRegExp = /(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gi;
const fullSiteRegExp = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/gi;
const emailRegExp =
	/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gi;
const fullEmailRegExp =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;

type StyledAnchor = StyledComponent<'a', any, {}, never>;

const DefaultAnchor = styled.a``;

export const replaceHrefsByAnchors = (
	text: string,
	CustomAnchor: StyledAnchor = DefaultAnchor
): (string | JSX.Element)[] => {
	const siteMatch = text.match(siteRegExp);

	if (siteMatch) {
		const slices = text
			.split(new RegExp(siteMatch.join('|')))
			.filter(Boolean);

		for (let i = 0; i < siteMatch.length; i++) {
			slices.splice(i * 2 + 1, 0, siteMatch[i]);
		}

		for (let i = 0; i < slices.length - 1; i++) {
			if (slices[i].charAt(slices[i].length - 1) === '@') {
				slices[i] += slices[i + 1];
				slices.splice(i + 1, 1);
			}
		}

		let res: (string | JSX.Element)[] = [];

		for (const slice of slices) {
			if (slice.match(fullSiteRegExp)) {
				const element = (
					<CustomAnchor target='_blank' key={slice} href={slice}>
						{slice}
					</CustomAnchor>
				);

				res.push(element);
			} else {
				const emailMatch = slice.match(emailRegExp);

				if (emailMatch) {
					let emailSlices = slice
						.split(new RegExp(emailMatch.join('|')))
						.filter((str) => Boolean(str.trim()));

					for (let i = 0; i < emailMatch.length; i++) {
						emailSlices.splice(i * 2 + 1, 0, emailMatch[i]);
					}
					if (emailSlices.length === 0) emailSlices = [emailMatch[0]];

					for (const emailSlice of emailSlices) {
						if (emailSlice.match(fullEmailRegExp)) {
							const element = (
								<CustomAnchor
									key={emailSlice}
									href={`mailto:${emailSlice}`}
								>
									{emailSlice}
								</CustomAnchor>
							);

							res.push(element);
						} else {
							res.push(emailSlice);
						}
					}
				} else {
					res.push(slice);
				}
			}
		}

		return res;
	} else {
		return [text];
	}
};
