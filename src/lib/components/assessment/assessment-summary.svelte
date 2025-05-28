<script lang="ts">
	import { ProblemDifficulty, type StateAssessment } from '$lib/services/models';
	import { friendlyDateTime } from '$lib/utils';

	let {
		assessment
	}: {
		assessment: StateAssessment;
	} = $props();

	function getProblemText(count: number): string {
		return count <= 1 ? 'Problem' : 'Problems';
	}

	function getMinutesText(minutes: number): string {
		return minutes <= 1 ? 'Minute' : 'Minutes';
	}

	const {
		numberOfProblems,
		numberOfEasyProblems,
		numberOfMediumProblems,
		numberOfHardProblems,
		group,
		attemptTimeLimit,
		reviewTimeLimit,
		lastUpdated
	} = $derived.by(() => {
		const getProblemsCount = (difficulty: ProblemDifficulty) => {
			return assessment.problems.filter((problem) => problem.difficulty === difficulty).length;
		};
		return {
			numberOfProblems: assessment.problems.length,
			numberOfEasyProblems: getProblemsCount(ProblemDifficulty.EASY),
			numberOfMediumProblems: getProblemsCount(ProblemDifficulty.MEDIUM),
			numberOfHardProblems: getProblemsCount(ProblemDifficulty.HARD),
			group: assessment.group,
			attemptTimeLimit: Math.floor(assessment.attemptTimeLimit / (60 * 60)), // Convert seconds to minutes
			reviewTimeLimit: Math.floor(assessment.reviewTimeLimit / (60 * 60)), // Convert seconds to minutes
			lastUpdated: friendlyDateTime(assessment.updatedAt)
		};
	});
</script>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="dark:bg-secondary-800 flex flex-col items-center rounded-lg bg-white p-4 shadow">
		<h2 class="text-lg font-bold">{lastUpdated}</h2>
		<p class="text-sm text-gray-500">Last Updated</p>
	</div>
	<div class="dark:bg-secondary-800 flex flex-col items-center rounded-lg bg-white p-4 shadow">
		<h2 class="text-2xl font-bold">{numberOfProblems}</h2>
		<p class="text-sm text-gray-500">Problems</p>
	</div>
	<div
		class="dark:bg-secondary-800 hidden flex-col items-center rounded-lg bg-white p-4 shadow md:flex"
	>
		<h2 class="text-2xl font-bold">{numberOfEasyProblems}</h2>
		<p class="text-sm text-gray-500">Easy {getProblemText(numberOfEasyProblems)}</p>
	</div>
	<div
		class="dark:bg-secondary-800 hidden flex-col items-center rounded-lg bg-white p-4 shadow md:flex"
	>
		<h2 class="text-2xl font-bold">{numberOfMediumProblems}</h2>
		<p class="text-sm text-gray-500">Medium {getProblemText(numberOfMediumProblems)}</p>
	</div>
	<div
		class="dark:bg-secondary-800 hidden flex-col items-center rounded-lg bg-white p-4 shadow md:flex"
	>
		<h2 class="text-2xl font-bold">{numberOfHardProblems}</h2>
		<p class="text-sm text-gray-500">Hard {getProblemText(numberOfHardProblems)}</p>
	</div>
	<div class="dark:bg-secondary-800 flex flex-col items-center rounded-lg bg-white p-4 shadow">
		<h2 class="text-2xl font-bold">{group}</h2>
		<p class="text-sm text-gray-500">Group</p>
	</div>
	<div class="dark:bg-secondary-800 flex flex-col items-center rounded-lg bg-white p-4 shadow">
		<h2 class="text-2xl font-bold">{attemptTimeLimit} {getMinutesText(attemptTimeLimit)}</h2>
		<p class="text-sm text-gray-500">Attempt Time Limit</p>
	</div>
	<div class="dark:bg-secondary-800 flex flex-col items-center rounded-lg bg-white p-4 shadow">
		<h2 class="text-2xl font-bold">{reviewTimeLimit} {getMinutesText(reviewTimeLimit)}</h2>
		<p class="text-sm text-gray-500">Review Time Limit</p>
	</div>
</div>
